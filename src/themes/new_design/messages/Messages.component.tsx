import React, { useEffect } from "react";
import "./Messages.component.scss";
import "./components/MessagePopup.component.scss";
import {
  Box,
  Button,
  Skeleton,
  TablePagination,
  Typography,
} from "@mui/material";
import {
  useLazyGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@shared/services/Notifications.service";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useAuth } from "@shared/providers/Auth.provider";
import moment from "moment";
import { MessagePopupComponent } from "./components/MessagePopup.component";
import { NotificationDto } from "@shared/dtos/messages.dtos";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import {
  selectNotifications,
  selectNotificationsCount,
} from "@shared/redux/slices/notificationsSlice";
import { TablePaginationActions } from "@shared/components/TablePaginationActions";
import { showToast } from "@shared/utils/showToast";

export const MessagesComponent = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const user = useSelector(selectUser);
  const notifications = useSelector(selectNotifications);
  const totalCount = useSelector(selectNotificationsCount);
  const [getNotifications, { isFetching }] = useLazyGetNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [page, setPage] = React.useState(0);
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] =
    React.useState<NotificationDto | null>(null);

  const rowsPerPage = 5;

  useEffect(() => {
    if (isAuthenticated) {
      const request = getNotifications({
        apar_id: user?.accountNumber || parseInt(user?.customerNo || "0"),
        $count: true,
        $orderby: "SentDate desc",
        $skip: page * rowsPerPage,
        $top: rowsPerPage,
      });

      return () => {
        request.abort();
      };
    }
  }, [isAuthenticated, page]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      showToast("success", t("MESSAGE_PAGE.MARK_ALL_AS_READ_SUCCESS"));
    } catch (error) {
      console.error("Error marking all as read:", error);
      showToast("error", t("MESSAGE_PAGE.MARK_ALL_AS_READ_ERROR"));
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const showMessagePopup = (message: NotificationDto) => {
    setSelectedNotification(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="messages rates_statement_container ">
      <Box className="messages_header">
        {t("MESSAGE_PAGE.TITLE")}
        <Button
          startIcon={<CheckBoxIcon />}
          onClick={handleMarkAllAsRead}
          className="btn-secondary"
        >
          {t("MESSAGE_PAGE.MARK_ALL_AS_READ")}
        </Button>
      </Box>
      <Box className="personal_box messages_content">
        <Box className="messages_list" sx={{ paddingTop: "1rem" }}>
          {!isFetching &&
            notifications?.map((item, index) => (
              <Box
                key={item.notificationId}
                className="message"
                onClick={() => showMessagePopup(item)}
                tabIndex={-1 * (index + 1)}
              >
                <Typography
                  variant="h6"
                  component="div"
                  className={`message_title ${item.isRead ? "read" : "unread"}`}
                >
                  <span>{item.title}</span>
                  <Typography variant="body2" className="message_date">
                    {moment(item.sentDate).format("DD MMM YYYY (hh:mm A)")}
                  </Typography>
                </Typography>
                <Typography variant="body1" className="message_body">
                  {Array(120).fill(item.message).join(" ")}
                </Typography>
              </Box>
            ))}
          {isFetching && (
            <Box className="message" tabIndex={-1}>
              <Typography
                variant="h6"
                component="div"
                className="message_title"
              >
                <span>
                  <Skeleton role="progressbar" aria-label="Message Title" />
                </span>
                <Typography variant="body2" className="message_date">
                  <Skeleton role="progressbar" aria-label="Message Date" />
                </Typography>
              </Typography>
              <Typography variant="body1" className="message_body">
                <Skeleton
                  aria-label="Message body"
                  role="progressbar"
                  width={"100%"}
                />
                <Skeleton
                  aria-label="Message body"
                  role="progressbar"
                  width={"100%"}
                />
                <Skeleton
                  aria-label="Message body"
                  role="progressbar"
                  width={"100%"}
                />
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ paddingTop: "1rem" }}>
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      </Box>
      {selectedNotification && (
        <MessagePopupComponent
          open={open}
          onClose={handleClose}
          message={selectedNotification}
        />
      )}
    </Box>
  );
};
