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
import { ToastContainer, toast } from "react-toastify";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export type NotificationProps = {
  title: string;
};
export const Notification = (props: any): JSX.Element => {
  const { closeToast, data, ...rest } = props;
  console.log(rest);
  return (
    <Box className="notification">
      <Typography component="h3">{data?.title || "Title"}</Typography>
      <Typography component="span">{data?.body || "Body"}</Typography>
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
      toast.success(Notification, {
        data: {
          title: "Success",
          body: t(notify),
        },
        autoClose: notifyDuration || 5000,
        onClose: () => {
          setShow(false);
          dispatch(clearNotify());
        },
      });
    }
    if (error) {
      toast.error(Notification, {
        data: {
          title: "Error",
          body: t(error),
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
      icon={({ type, theme }) => {
        // theme is not used in this example but you could
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
