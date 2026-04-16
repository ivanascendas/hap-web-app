import { useTranslation } from "react-i18next";
import { useAuth } from "@shared/providers/Auth.provider";
import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  TablePagination,
} from "@mui/material";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { useLazyReportQuery } from "@shared/services/Notifications.service";
import { NotificationReportDto } from "@shared/dtos/messages.dtos";
import "./notifications-report.component.scss";
import { TablePaginationActions } from "@components/admin/components/TablePaginationActions";

export const NotificationsReportComponent = (): JSX.Element => {
  const top = 9;
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);

  const [fetch, { data: notifications, isFetching }] = useLazyReportQuery();

  useEffect(() => {
    if (isAuthenticated) {
      fetch({
        $count: true,
        $orderby: `SentDate desc`,
        $skip: page * top,
        $top: top,
      });
    }
  }, [fetch, page, top, isAuthenticated]);

  const columns: ColumnItem<NotificationReportDto>[] = [
    {
      key: "sentDate",
      label: "ADMIN.NOTIFICATIONS.SUMMARY_TABLE.COLUMNS.NOTIFICATION_DATE",
      rowRender: (row: NotificationReportDto) =>
        new Date(row.sentDate).toLocaleDateString(),
    },
    {
      key: "message",
      label: "ADMIN.NOTIFICATIONS.SUMMARY_TABLE.COLUMNS.NOTIFICATION_MESSAGE",
    },
    {
      key: "androidSuccessCount",
      label: "ADMIN.NOTIFICATIONS.SUMMARY_TABLE.COLUMNS.NOTIFICATION_STATUS",
      rowRender: (row: NotificationReportDto) => "success",
    },

    {
      key: "notificationCount",
      label: "ADMIN.NOTIFICATIONS.SUMMARY_TABLE.COLUMNS.NOTIFICATION_AMOUNT",
    },
    {
      key: "iosSuccessCount",
      label: "ADMIN.NOTIFICATIONS.SUMMARY_TABLE.COLUMNS.NOTIFICATION_DEVICES",
      rowRender: (item: NotificationReportDto) => (
        <>
          <i className="fab fa-android" aria-hidden="true"></i>
          &nbsp;
          <span
            className={item.androidSuccessCount ? "success-notification" : ""}
          >
            {item.androidSuccessCount}
          </span>
          /
          <span
            className={item.androidFailedCount ? "failed-notification" : ""}
          >
            {item.androidFailedCount}
          </span>
          &nbsp; &nbsp;
          <i
            className="fab fa-apple"
            style={{ color: "#224d96" }}
            aria-hidden="true"
          ></i>
          &nbsp;
          <span className={item.iosSuccessCount ? "success-notification" : ""}>
            {item.iosSuccessCount}
          </span>
          /
          <span className={item.iosFailedCount ? "failed-notification" : ""}>
            {item.iosFailedCount}
          </span>
        </>
      ),
    },
  ];

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        maxHeight: "calc(100vh - 130px)",
      }}
    >
      <Box sx={{ marginTop: "2rem" }}>
        <TableComponent
          aria-label="customers table"
          isLoading={isFetching}
          columns={columns}
          rows={notifications?.items || []}
          onItemClick={() => {}}
          className="admin-table"
        />
        <Box
          className="personal_box_footer"
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "space-between",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[top]}
            component="div"
            count={notifications?.count || 0}
            rowsPerPage={top}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={({ from, to, count }) =>
              `Showing ${from} to ${to} of ${count} entries`
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
