import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PasswordsFormComponent } from "../../account/compomnents/PasswordsForm.component";
import { MFAControlComponent } from "../../account/compomnents/MFAControl.component";
import "./password.component.scss";
import { NotificationComponent } from "../../../shared/components/Notification.component";
import { MFAMethod } from "../../../shared/dtos/user.dto";
import { ExsistingTenantDto } from "../../../shared/dtos/existing-tenant.dto";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../../shared/redux/slices/authSlice";
import { useSaveUserDataMutation } from "../../../shared/services/Auth.service";

export const PasswordComponent = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [updateUser, result] = useSaveUserDataMutation();
  const dispatch = useDispatch();
  const mfaChangeHandler = (mfaMethod: MFAMethod) => {
    const model: ExsistingTenantDto = {
      EmailId: user?.email || "",
      PhoneNumber: user?.phone || "",
      PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
      EmailConfirmed: user?.emailConfirmed || false,
      DefaultMFA: mfaMethod || "Email",
      PhoneCountryCode: user?.phoneCountryCode || "353",
      PhoneExcludingCountryCode:
        user?.phone?.replace(user?.phoneCountryCode || "353", "") || "",
    };

    updateUser(model).then((res) => {
      dispatch(
        setUser({
          defaultMFA: model.DefaultMFA as MFAMethod,
          email: model.EmailId,
          phone: model.PhoneNumber,
          phoneCountryCode: model.PhoneCountryCode,
          phoneExcludingCountryCode: model.PhoneExcludingCountryCode,
          emailConfirmed: model.EmailConfirmed,
          phoneNumberConfirmed: model.PhoneNumberConfirmed,
        }),
      );
    });
  };

  return (
    <Box p={3} sx={{ overflow: "auto", maxHeight: "calc(100vh - 160px)" }}>
      <Box className="personal_box admin-password" mb="2rem">
        <Typography variant="h4" mb="2rem" component="h2">
          {t("ADMIN.PASSWORD.TITLE")}
        </Typography>
        <PasswordsFormComponent isLoading={false} />
        <Box mt="2rem" className="mfa-control">
          <MFAControlComponent
            defaultValue={user?.defaultMFA} // Add this line
            onChange={(e) => mfaChangeHandler(e.target.value as MFAMethod)}
          />
        </Box>
      </Box>
    </Box>
  );
};
