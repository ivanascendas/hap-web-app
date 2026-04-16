import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NotificationsSendDto } from "@shared/dtos/messages.dtos";
import {
  useSendExcelNotificationMutation,
  useSendNotificationMutation,
} from "@shared/services/Notifications.service";
import { useDispatch } from "react-redux";
import { setError } from "@shared/redux/slices/errorSlice";
import { setNotify } from "@shared/redux/slices/notifySlice";
import { NotificationsReportComponent } from "./components/notifications-report.component";

export const AdminNotificationsComponent = () => {
  const { type } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [file, setFile] = React.useState<File>();
  const [send] = useSendNotificationMutation();
  const [sendExcel] = useSendExcelNotificationMutation();
  const dispatch = useDispatch();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    navigate(`/admin/notifications/${newAlignment}`);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<NotificationsSendDto>();

  const {
    register: registerExcel,
    handleSubmit: handleSubmitExcel,
    reset: resetExcel,
    formState: { errors: errorsExcel, isValid: isValidExcel },
  } = useForm<NotificationsSendDto>();

  const snedNotification = async (data: NotificationsSendDto) => {
    try {
      await send({ ...data, customerNumbers: [] });
      dispatch(setNotify({ message: "MESSAGES.SUCCESS_MESSAGEG_SENT" }));
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const snedExcelNotification = async (model: NotificationsSendDto) => {
    try {
      if (file) {
        await sendExcel({ file, model });
        dispatch(setNotify({ message: "MESSAGES.SUCCESS_MESSAGEG_SENT" }));
        resetExcel();
      } else {
        dispatch(setError({ message: "file doesn't selected" }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="personal_box">
      <>
        <Box className="admin-container__header">
          <ToggleButtonGroup
            color="primary"
            value={type}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="forms">
              {t("CONTENTS.NAV.NOTIFICATIONS")}
            </ToggleButton>
            <ToggleButton value="reports">
              {t("CONTENTS.NAV.REPORTS")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </>
      <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 220px)" }}>
        {type === "forms" && (
          <>
            <Typography
              variant="h5"
              sx={{
                margin: "1rem 0",
                fontWeight: "bold",
              }}
            >
              {t("CONTENTS.TITLE.PUSHNOTIFICATION")}
            </Typography>
            <Box>
              <form>
                <TextField
                  label={t("CONTENTS.TABLE.TITLE")}
                  sx={{
                    width: "100%",
                    marginBottom: "1.5rem",
                  }}
                  {...register("title", { required: true })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
                <TextField
                  multiline
                  rows={4}
                  label={t("CONTENTS.TABLE.MESSAGE")}
                  sx={{
                    width: "100%",
                    marginBottom: "1.5rem",
                  }}
                  {...register("message", { required: true })}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
                <Button
                  disabled={!isValid}
                  onClick={handleSubmit(snedNotification)}
                  variant="contained"
                  color="primary"
                  className="admin_main-button"
                >
                  {t("CONTENTS.BUTTON.SEND")}
                </Button>
              </form>
            </Box>
            <Typography
              variant="h5"
              sx={{
                margin: "1rem 0",
                fontWeight: "bold",
              }}
            >
              {t("CONTENTS.TABLE.EXCEL_FILE")}
            </Typography>
            <Box>
              <form>
                <Box display="flex" gap="1rem">
                  <TextField
                    label={t("CONTENTS.TABLE.TITLE")}
                    sx={{
                      flex: 0.5,
                      marginBottom: "1.5rem",
                    }}
                    {...registerExcel("title", { required: true })}
                    error={!!errorsExcel.title}
                    helperText={errorsExcel.title?.message}
                  />
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    sx={{
                      flex: "none",
                      marginBottom: "1.5rem",
                    }}
                    className="admin_blue-button"
                    startIcon={<CloudUploadIcon />}
                  >
                    {file?.name || "Upload CSV"}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) =>
                        event.target?.files?.item(0) &&
                        setFile(event.target.files[0])
                      }
                      multiple
                    />
                  </Button>
                </Box>
                <TextField
                  multiline
                  rows={4}
                  label={t("CONTENTS.TABLE.MESSAGE")}
                  sx={{
                    width: "100%",
                    marginBottom: "1.5rem",
                  }}
                  {...registerExcel("message", { required: true })}
                  error={!!errorsExcel.message}
                  helperText={errorsExcel.message?.message}
                />
                <Button
                  disabled={!isValidExcel}
                  variant="contained"
                  onClick={handleSubmitExcel(snedExcelNotification)}
                  color="primary"
                  className="admin_main-button"
                >
                  {t("CONTENTS.BUTTON.SEND")}
                </Button>
              </form>
            </Box>
          </>
        )}
        {type === "reports" && <NotificationsReportComponent />}
      </Box>
    </Box>
  );
};
