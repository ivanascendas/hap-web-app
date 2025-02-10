import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useGetMessagesQuery,
  useSetMessagesMutation,
} from "../../../shared/services/Messages.service";
import { ErrorMessagesDto } from "../../../shared/dtos/message.dto";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";
import "./messages.component.scss";
import { setNotify } from "../../../shared/redux/slices/notifySlice";
import { useDispatch } from "react-redux";
import { NotificationComponent } from "../../../shared/components/Notification.component";

export const AdminMessagesComponent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: defaultValues, error, isLoading } = useGetMessagesQuery();
  const [saveMessages] = useSetMessagesMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    getValues,
    setError,
    reset,
  } = useForm<ErrorMessagesDto>({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading) {
      reset(defaultValues);
    }
  }, [isLoading]);

  const onSubmit = async (data: ErrorMessagesDto) => {
    await saveMessages(data).unwrap();
    dispatch(setNotify({ message: t("MESSAGES.MESSAGES_SAVED") }));
  };

  return (
    <Box p={3} className="messages-page">
      <Box className="personal_box " mb="2rem">
        <NotificationComponent />
        <Typography variant="h4" mb="2rem" component="h2">
          Messages control
        </Typography>
        <Box>
          <Box className="personal_box_row personal_box_row_header">
            <strong>{t("MESSAGE_PAGE.KEY")}</strong>
            <strong>{t("MESSAGE_PAGE.TITLE")}</strong>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 360px)" }}>
              <Box className="personal_box_row">
                <Typography component="span">
                  regCustomerNumberNotExists
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("regCustomerNumberNotExists")}
                  error={!!errors.regCustomerNumberNotExists}
                  helperText={getErrorMessage(
                    errors.regCustomerNumberNotExists?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">
                  regCustomerAlreadyRegistered
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("regCustomerAlreadyRegistered")}
                  error={!!errors.regCustomerAlreadyRegistered}
                  helperText={getErrorMessage(
                    errors.regCustomerAlreadyRegistered?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">
                  regWrongCustomerNumberOrPassword
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("regWrongCustomerNumberOrPassword")}
                  error={!!errors.regWrongCustomerNumberOrPassword}
                  helperText={getErrorMessage(
                    errors.regWrongCustomerNumberOrPassword?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">regTempPasswordExpired</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("regTempPasswordExpired")}
                  error={!!errors.regTempPasswordExpired}
                  helperText={getErrorMessage(
                    errors.regTempPasswordExpired?.type,
                  )}
                />
              </Box>

              <Box className="personal_box_row">
                <Typography component="span">
                  resCustomerNumberNotExists
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("resCustomerNumberNotExists")}
                  error={!!errors.resCustomerNumberNotExists}
                  helperText={getErrorMessage(
                    errors.resCustomerNumberNotExists?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">
                  resCustomerNumberNotExists
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("resCustomerNumberNotExists")}
                  error={!!errors.resCustomerNumberNotExists}
                  helperText={getErrorMessage(
                    errors.resCustomerNumberNotExists?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">
                  resCustomerAlreadyRegistered
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("resCustomerAlreadyRegistered")}
                  error={!!errors.resCustomerAlreadyRegistered}
                  helperText={getErrorMessage(
                    errors.resCustomerAlreadyRegistered?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">capMissingInputSecret</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("capMissingInputSecret")}
                  error={!!errors.capMissingInputSecret}
                  helperText={getErrorMessage(
                    errors.capMissingInputSecret?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">capInvalidInputSecret</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("capInvalidInputSecret")}
                  error={!!errors.capInvalidInputSecret}
                  helperText={getErrorMessage(
                    errors.capInvalidInputSecret?.type,
                  )}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">
                  capMissingInputResponse
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("capMissingInputResponse")}
                  error={!!errors.capMissingInputResponse}
                  helperText={getErrorMessage(
                    errors.capMissingInputResponse?.type,
                  )}
                />
              </Box>

              <Box className="personal_box_row">
                <Typography component="span">
                  capInvalidInputResponse
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("capInvalidInputResponse")}
                  error={!!errors.capInvalidInputResponse}
                  helperText={getErrorMessage(
                    errors.capInvalidInputResponse?.type,
                  )}
                />
              </Box>

              <Box className="personal_box_row">
                <Typography component="span">capOtherCapthaError</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("capOtherCapthaError")}
                  error={!!errors.capOtherCapthaError}
                  helperText={getErrorMessage(errors.capOtherCapthaError?.type)}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">paymentErr1xx</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentErr1xx")}
                  error={!!errors.paymentErr1xx}
                  helperText={getErrorMessage(errors.paymentErr1xx?.type)}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">paymentErr2xx</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentErr2xx")}
                  error={!!errors.paymentErr2xx}
                  helperText={getErrorMessage(errors.paymentErr2xx?.type)}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">paymentErr3xx</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentErr3xx")}
                  error={!!errors.paymentErr3xx}
                  helperText={getErrorMessage(errors.paymentErr3xx?.type)}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">paymentErr5xx</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentErr5xx")}
                  error={!!errors.paymentErr5xx}
                  helperText={getErrorMessage(errors.paymentErr5xx?.type)}
                />
              </Box>
              <Box className="personal_box_row">
                <Typography component="span">paymentErr666</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentErr666")}
                  error={!!errors.paymentErr666}
                  helperText={getErrorMessage(errors.paymentErr666?.type)}
                />
              </Box>

              <Box className="personal_box_row">
                <Typography component="span">paymentSuccess</Typography>
                <TextField
                  multiline
                  rows={2}
                  {...register("paymentSuccess")}
                  error={!!errors.paymentSuccess}
                  helperText={getErrorMessage(errors.paymentSuccess?.type)}
                />
              </Box>
            </Box>
            <Box
              sx={{
                padding: "15px 0 0 0",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" type="submit">
                {t("BUTTONS.SAVE")}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
