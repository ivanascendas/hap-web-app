import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLazyGetApplicationsQuery } from "@shared/services/Refunds.service";
import { RefundStatus, RefundApplicationDto } from "@shared/dtos/refund.dtos";
import AddIcon from "@mui/icons-material/Add";
import "./RefundList.component.scss";
import { useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
import { TableComponent, ColumnItem } from "@shared/components/Table.component";
import { MobileRefundsListComponent } from "./components/MobileRefundsList.component";

export const RefundListPage = (): JSX.Element => {
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "">("");

  // Screen size detection
  const isMobile = useMediaQuery("(max-width:768px)");

  const [loadMineRefunds, { data, isLoading, error }] =
    useLazyGetApplicationsQuery();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (
    status: RefundStatus,
  ): "default" | "primary" | "success" | "error" | "warning" => {
    switch (status) {
      case RefundStatus.Approved:
        return "success";
      case RefundStatus.Rejected:
        return "error";
      case RefundStatus.Submitted:
      case RefundStatus.ReturnedForInfo:
        return "warning";
      case RefundStatus.Posted:
        return "primary";
      default:
        return "default";
    }
  };

  const columns: ColumnItem<RefundApplicationDto>[] = [
    {
      key: "applicantName",
      label: "REFUNDS.LIST.APPLICATION_NUMBER",
      rowRender: (row: RefundApplicationDto) => (
        <Typography variant="body2" fontFamily="monospace">
          {row.referenceCode} - {row.applicantName}
        </Typography>
      ),
    },
    {
      key: "amount",
      label: "REFUNDS.LIST.REQUESTED_AMOUNT",
      rowRender: (row) => `€${row.amount?.toFixed(2) || "0.00"}`,
    },
    // ...existing code...
    {
      key: "status",
      label: "REFUNDS.LIST.STATUS",
      rowRender: (row) => {
        const knownStatuses: RefundStatus[] = [
          RefundStatus.Approved,
          RefundStatus.Rejected,
          RefundStatus.Posted,
          RefundStatus.ReturnedForInfo,
        ];
        const statusKey = knownStatuses.includes(row.status) ? row.status : 11;
        return (
          <Chip
            label={t(`REFUNDS.STATUS.${statusKey}`)}
            color={getStatusColor(row.status)}
            size="small"
          />
        );
      },
    },
    // ...existing code...
    {
      key: "updatedAt",
      label: "REFUNDS.LIST.SUBMITTED_DATE",
      rowRender: (row) =>
        row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-",
    },
    {
      key: "applicationId",
      label: "REFUNDS.LIST.ACTIONS",
      rowRender: (row) => (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/refunds/${row.applicationId}`);
          }}
        >
          {t("REFUNDS.LIST.VIEW")}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (user) {
      loadMineRefunds({
        $top: rowsPerPage,
        $skip: page * rowsPerPage,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
    }
  }, [user, page, rowsPerPage, statusFilter, loadMineRefunds]);

  return (
    <Box
      className={`refund-list-container personal_box personal_box_content ${isMobile ? "refund-list-container--mobile" : ""}`}
      sx={{ margin: isMobile ? "0.5rem" : "1.5rem" }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        mb={isMobile ? 2 : 3}
        gap={isMobile ? 1.5 : 0}
      >
        <Typography variant={isMobile ? "h5" : "h4"}>
          {t("REFUNDS.LIST.TITLE")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/refunds/new")}
          fullWidth={isMobile}
        >
          {t("REFUNDS.LIST.NEW_APPLICATION")}
        </Button>
      </Box>

      <Box mb={isMobile ? 2 : 3}>
        <FormControl
          fullWidth={isMobile}
          sx={{ minWidth: isMobile ? "100%" : 200 }}
        >
          <InputLabel>{t("REFUNDS.LIST.FILTER_STATUS")}</InputLabel>
          <Select
            value={statusFilter}
            label={t("REFUNDS.LIST.FILTER_STATUS")}
            onChange={(e) =>
              setStatusFilter(e.target.value as RefundStatus | "")
            }
          >
            <MenuItem value="">
              <em>{t("REFUNDS.LIST.ALL")}</em>
            </MenuItem>
            {Object.values(RefundStatus)
              .filter((s) => typeof s === "number")
              .map((status) => {
                return (
                  <MenuItem key={status} value={status}>
                    {t(`REFUNDS.STATUS.${status}`)}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Typography>{t("COMMON.LOADING")}</Typography>
      ) : error ? (
        <Typography color="error">{t("ERRORS.SERVER_ERROR")}</Typography>
      ) : (
        <>
          {isMobile ? (
            <MobileRefundsListComponent
              list={data?.items || []}
              isLoading={isLoading}
              onItemClick={(row) => navigate(`/refunds/${row.applicationId}`)}
              getStatusColor={getStatusColor}
            />
          ) : (
            <TableComponent
              columns={columns}
              rows={data?.items || []}
              rowKey="applicationId"
              onItemClick={(row) => navigate(`/refunds/${row.applicationId}`)}
              isLoading={isLoading}
            />
          )}
          <TablePagination
            rowsPerPageOptions={isMobile ? [10, 20] : [10, 20, 50]}
            component="div"
            count={data?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={isMobile ? t("COMMON.ROWS") : undefined}
          />
        </>
      )}
    </Box>
  );
};
