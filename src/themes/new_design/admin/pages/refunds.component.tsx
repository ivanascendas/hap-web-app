import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TablePagination,
  CircularProgress,
  Button,
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
import { useLazyGetAdminApplicationsQuery } from "@shared/services/Refunds.service";
import { TablePaginationActions } from "@shared/components/TablePaginationActions";
import { TableComponent } from "@shared/components/Table.component";
import { RefundFilters } from "../components/refunds/RefundFilters";
import { RefundStatusBadge } from "../components/refunds/RefundStatusBadge";
import { formatCurrency, formatDate } from "../utils/statusLabels";
import "./refunds.component.scss";
import { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import { useUserRole } from "@shared/hooks/useUserRole";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

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
  // Fetch data - hooks must be called before any early returns
  const hasRoleAccess =
    user?.isAdmin ||
    user?.isSuperAdmin ||
    hasRole("DMU_L1") ||
    hasRole("DMU_L2") ||
    hasRole("AP");
  const [getAdminApplications, { data, isFetching, isError }] =
    useLazyGetAdminApplicationsQuery();

  useEffect(() => {
    if (hasRoleAccess) {
      getAdminApplications({
        $skip: pagination.pageNumber * pagination.pageSize,
        $top: pagination.pageSize,
        statuses: filters.status,
        tenantId: filters.customerNo,
        incDept: filters.incDept,
      });
    }
  }, [user, getAdminApplications, filters, pagination]);

  const applications = data?.items || [];
  const totalCount = data?.count || 0;

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

  // Table columns configuration
  const columns = [
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
            />
          </>
        )}
      </Paper>
    </Box>
  );
};
