import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TablePagination,
  CircularProgress,
  Button,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AdminFiltersState,
  selectAdminFilters,
  selectAdminPagination,
  setAdminFilters,
  setAdminPagination,
} from "@shared/redux/slices/adminRefundSlice";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useGetAdminsQuery } from "@shared/services/Admins.service";
import {
  useLazyGetAdminApplicationsQuery,
  useReassignApplicationsMutation,
} from "@shared/services/Refunds.service";
import { TablePaginationActions } from "@components/admin/components/TablePaginationActions";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { RefundFilters } from "../components/refunds/RefundFilters";
import { RefundStatusBadge } from "../components/refunds/RefundStatusBadge";
import { formatCurrency, formatDate } from "../utils/statusLabels";
import "./refunds.component.scss";
import { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import { useUserRole } from "@shared/hooks/useUserRole";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { AdminDto } from "@shared/dtos/admins.dtos";
import { hasAssignableRole } from "../components/refunds/BulkReassignControls";
import { BulkReassignConfirmDialog } from "../components/refunds/BulkReassignConfirmDialog";
import { showToast } from "@shared/utils/showToast";

/**
 * RefundsComponent - Admin page for managing refund applications
 *
 * Features:
 * - Filters by status, customer number, department
 * - Pagination with configurable page size
 * - Table view with sortable columns
 * - Navigation to detail page
 * - Role-based access control
 */
export const RefundsComponent: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const filters = useSelector(selectAdminFilters);
  const pagination = useSelector(selectAdminPagination);
  const { hasRole } = useUserRole();
  const { t } = useTranslation();
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    string[]
  >([]);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminDto | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);
  // Fetch data - hooks must be called before any early returns
  const hasRoleAccess =
    user?.isAdmin ||
    user?.isSuperAdmin ||
    hasRole("DMU_L1") ||
    hasRole("DMU_L2") ||
    hasRole("AP");
  const [getAdminApplications, { data, isFetching, isError }] =
    useLazyGetAdminApplicationsQuery();
  const { data: adminOptions, isFetching: isAdminsFetching } =
    useGetAdminsQuery(undefined, {
      skip: !hasRoleAccess,
    });
  const [reassignApplication] = useReassignApplicationsMutation();

  const adminApplicationQueryArgs = useMemo(
    () => ({
      $skip: pagination.pageNumber * pagination.pageSize,
      $top: pagination.pageSize,
      statuses: filters.status,
      tenantId: filters.customerNo,
      incDept: filters.incDept,
      assignedToId: filters.assignedToId,
    }),
    [filters, pagination],
  );

  useEffect(() => {
    if (hasRoleAccess) {
      getAdminApplications(adminApplicationQueryArgs);
    }
  }, [user, getAdminApplications, hasRoleAccess, adminApplicationQueryArgs]);

  const applications = data?.items || [];
  const totalCount = data?.count || 0;
  const assignableAdmins = useMemo(
    () => (adminOptions || []).filter(hasAssignableRole),
    [adminOptions],
  );
  const currentPageApplicationIds = useMemo(
    () => applications.map((application) => application.applicationId),
    [applications],
  );
  const isCurrentPageAllSelected =
    currentPageApplicationIds.length > 0 &&
    currentPageApplicationIds.every((applicationId) =>
      selectedApplicationIds.includes(applicationId),
    );
  const isCurrentPagePartiallySelected =
    currentPageApplicationIds.some((applicationId) =>
      selectedApplicationIds.includes(applicationId),
    ) && !isCurrentPageAllSelected;

  // Check if user has admin access
  if (!hasRoleAccess) {
    return (
      <Box className="personal_box" sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You do not have permission to view this page.
        </Typography>
      </Box>
    );
  }

  // Handlers
  const handleFilterChange = (newFilters: AdminFiltersState) => {
    dispatch(setAdminFilters(newFilters));
    dispatch(setAdminPagination({ pageNumber: 0 })); // Reset to first page
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setAdminPagination({ pageNumber: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log("Rows per page changed:", event.target.value);
    dispatch(
      setAdminPagination({
        pageSize: parseInt(event.target.value),
        pageNumber: 0,
      }),
    );
  };

  const handleRowClick = (app: RefundApplicationDto) => {
    navigate(`/admin/refunds/${app.applicationId}`);
  };

  const toggleApplicationSelection = (applicationId: string) => {
    setSelectedApplicationIds((currentIds) =>
      currentIds.includes(applicationId)
        ? currentIds.filter((id) => id !== applicationId)
        : [...currentIds, applicationId],
    );
  };

  const toggleCurrentPageSelection = () => {
    setSelectedApplicationIds((currentIds) => {
      if (isCurrentPageAllSelected) {
        return currentIds.filter(
          (id) => !currentPageApplicationIds.includes(id),
        );
      }

      return Array.from(new Set([...currentIds, ...currentPageApplicationIds]));
    });
  };

  const handleOpenBulkAssignConfirm = () => {
    if (selectedApplicationIds.length === 0 || !selectedAdmin) {
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleBulkAssignConfirm = async () => {
    if (!selectedAdmin || selectedApplicationIds.length === 0) {
      return;
    }

    setIsBulkAssigning(true);

    const applicationIds = [...selectedApplicationIds];
    const results = await Promise.allSettled(
      applicationIds.map((applicationId) =>
        reassignApplication({
          applicationId,
          targetAdminId: selectedAdmin.userName,
        })
          .unwrap()
          .then(() => applicationId),
      ),
    );

    const failedApplicationIds = results
      .map((result, index) =>
        result.status === "rejected" ? applicationIds[index] : null,
      )
      .filter((applicationId): applicationId is string => !!applicationId);
    const successCount = applicationIds.length - failedApplicationIds.length;

    setIsBulkAssigning(false);
    setIsConfirmOpen(false);

    if (failedApplicationIds.length === 0) {
      setSelectedApplicationIds([]);
      showToast(
        "success",
        t("REFUNDS.BULK_REASSIGN.SUCCESS", { count: successCount }),
      );
    } else if (successCount > 0) {
      setSelectedApplicationIds(failedApplicationIds);
      showToast(
        "warning",
        t("REFUNDS.BULK_REASSIGN.PARTIAL_SUCCESS", {
          successCount,
          failedCount: failedApplicationIds.length,
        }),
      );
    } else {
      showToast("error", t("REFUNDS.BULK_REASSIGN.ERROR"));
    }

    getAdminApplications(adminApplicationQueryArgs);
  };

  // Table columns configuration
  const columns: ColumnItem<RefundApplicationDto>[] = [
    {
      key: "selection" as keyof RefundApplicationDto,
      label: "",
      colSx: { width: 48 },
      calSx: { width: 48 },
      colRnder: () => (
        <Checkbox
          aria-label={t("REFUNDS.BULK_REASSIGN.SELECT_PAGE")}
          checked={isCurrentPageAllSelected}
          indeterminate={isCurrentPagePartiallySelected}
          disabled={applications.length === 0}
          onChange={toggleCurrentPageSelection}
          onClick={(event) => event.stopPropagation()}
          size="small"
        />
      ),
      rowRender: (row: RefundApplicationDto) => (
        <Checkbox
          aria-label={t("REFUNDS.BULK_REASSIGN.SELECT_APPLICATION", {
            reference: row.referenceCode || row.applicationId,
          })}
          checked={selectedApplicationIds.includes(row.applicationId)}
          onChange={() => toggleApplicationSelection(row.applicationId)}
          onClick={(event) => event.stopPropagation()}
          size="small"
        />
      ),
    },
    {
      key: "applicationId",
      label: "Application ID",
      rowRender: (row: RefundApplicationDto) => (
        <Typography variant="body2" fontFamily="monospace">
          {row.referenceCode}
        </Typography>
      ),
    },
    {
      key: "tenantId",
      label: "Customer No",
    },
    {
      key: "applicantName",
      label: "Applicant",
    },
    {
      key: "amount",
      label: "Amount",
      rowRender: (row: RefundApplicationDto) =>
        formatCurrency(row.amount, row.currency || "EUR"),
    },
    {
      key: "assignedToId",
      label: "Assigned To",
    },
    {
      key: "status",
      label: "Status",
      rowRender: (row: RefundApplicationDto) => (
        <RefundStatusBadge status={row.status} />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      rowRender: (row: RefundApplicationDto) => formatDate(row.createdAt),
    },
  ];

  return (
    <Box className="personal_box" sx={{}}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" className="personal_box_title" sx={{ mb: 2 }}>
          Refund Applications Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/refunds/new")}
        >
          {t("REFUNDS.LIST.NEW_APPLICATION")}
        </Button>
      </Box>
      {/* Filters */}
      <RefundFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        departments={[]}
        adminOptions={assignableAdmins}
        selectedAdmin={selectedAdmin}
        selectedCount={selectedApplicationIds.length}
        isAdminLoading={isAdminsFetching}
        isBulkAssigning={isBulkAssigning}
        onSelectedAdminChange={setSelectedAdmin}
        onApplyBulkAssign={handleOpenBulkAssignConfirm}
      />

      {/* Table */}
      <Paper
        sx={{
          mt: 2,
          height: "calc(100vh - 22rem)",
          overflow: "auto",
        }}
      >
        {isFetching && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="error">
              Failed to load applications. Please try again.
            </Typography>
          </Box>
        )}

        {!isFetching && !isError && applications.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No applications found matching your filters.
            </Typography>
          </Box>
        )}

        {!isFetching && !isError && applications.length > 0 && (
          <>
            <TableComponent
              rows={applications}
              columns={columns}
              className="admin-table"
              onItemClick={handleRowClick}
              selected={(row: RefundApplicationDto) =>
                selectedApplicationIds.includes(row.applicationId)
              }
            />

            <TablePagination
              rowsPerPageOptions={[7, 15, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={pagination.pageSize}
              page={pagination.pageNumber}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
            />
          </>
        )}
      </Paper>
      <BulkReassignConfirmDialog
        open={isConfirmOpen}
        selectedAdmin={selectedAdmin}
        selectedCount={selectedApplicationIds.length}
        isSubmitting={isBulkAssigning}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleBulkAssignConfirm}
      />
    </Box>
  );
};
