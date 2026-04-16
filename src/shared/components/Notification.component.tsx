import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotify,
  selectNotifyDuration,
  clearNotify,
} from "../redux/slices/notifySlice";
import {
  clearError,
  selectError,
  selectErrorDuration,
} from "../redux/slices/errorSlice";
import "./Notification.compomnent.scss";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ToastContainer, ToastContentProps } from "react-toastify";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { showToastContent } from "../utils/showToast";

export type NotificationProps = {
  title: string;
};

export type NotificationData = {
  title: string;
  body: string;
};

export const Notification = (
  props: ToastContentProps<NotificationData>,
): JSX.Element => {
  const { closeToast, data } = props;
  return (
    <Box className="notification">
      <Typography component="h3">{data?.title || "Title"}</Typography>
      <Typography component="span">{data?.body || "Body"}</Typography>
      {closeToast && (
        <CloseIcon
          onClick={closeToast}
          style={{ cursor: "pointer", marginLeft: "auto" }}
        />
      )}
    </Box>
  );
};
export const NotificationComponent = (): JSX.Element => {
  const notify = useSelector(selectNotify);
  const error = useSelector(selectError);
  const errorDuration = useSelector(selectErrorDuration);
  const notifyDuration = useSelector(selectNotifyDuration);
  const dispatch = useDispatch();
  const [show, setShow] = React.useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (notify) {
      const body = t(notify);
      showToastContent("success", Notification, body, {
        data: {
          title: "Success",
          body,
        },
        autoClose: notifyDuration || 5000,
        onClose: () => {
          setShow(false);
          dispatch(clearNotify());
        },
      });
    }
    if (error) {
      const body = t(error);
      showToastContent("error", Notification, body, {
        data: {
          title: "Error",
          body,
        },
        autoClose: errorDuration || 5000,
        onClose: () => {
          setShow(false);
          dispatch(clearError());
        },
      });
    }
  }, [notify, error]);

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        if (notify) {
          dispatch(clearNotify());
        }
        if (error) {
          dispatch(clearError());
        }
      }, 1500);
    }
  }, [show]);

  return (
    <ToastContainer
      position="bottom-right"
      hideProgressBar={false}
      newestOnTop={false}
      autoClose={5000}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      icon={({ type }) => {
        // Custom icon based on notification type
        switch (type) {
          case "info":
            return <InfoOutlineIcon className="stroke-indigo-400" />;
          case "error":
            return <ErrorOutlineOutlinedIcon className="stroke-red-500" />;
          case "success":
            return <CheckCircleOutlineIcon className="stroke-green-500" />;
          case "warning":
            return <WarningAmberIcon className="stroke-yellow-500" />;
          default:
            return null;
        }
      }}
    />
  );
};
