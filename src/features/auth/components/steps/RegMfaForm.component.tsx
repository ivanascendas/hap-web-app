import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { MFAMethod } from "../../../../shared/dtos/user.dto";
import Grid from "@mui/material/Grid2";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectToken, selectUser } from "../../../../shared/redux/slices/authSlice";
import { useRegitrationMutation } from "../../../../shared/services/Auth.service";
import { UserModel } from "../../../../shared/models/user.model";
import { RegistrationRequestDto } from "../../../../shared/dtos/registration.dto";

/**
 * RegMfaFormComponent is a React functional component that renders a form for 
 * multi-factor authentication (MFA) registration. It allows users to select 
 * their preferred MFA method (SMS, Email, or None) and submit their registration 
 * details.
 *
 * @returns {JSX.Element} The rendered JSX element for the MFA registration form.
 *
 * @remarks
 * - The component uses the `useTranslation` hook from `react-i18next` for 
 *   internationalization.
 * - The `useNavigate` hook from `react-router-dom` is used for navigation.
 * - The `useDispatch` and `useSelector` hooks from `react-redux` are used for 
 *   state management.
 * - The `useRegitrationMutation` hook is used to trigger the registration 
 *   mutation.
 *
 * @component
 * @example
 * ```tsx
 * import { RegMfaFormComponent } from './RegMfaFormComponent';
 * 
 * const App = () => (
 *   <RegMfaFormComponent />
 * );
 * 
 * export default App;
 * ```
 */
export const RegMfaFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user: UserModel | null = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [register] = useRegitrationMutation();
  const MFA_SMS: MFAMethod = "SMS";
  const MFA_EMAIL: MFAMethod = "Email";
  const MFA_NONE: MFAMethod = "None";

  const [mfa, setMFA] = useState<MFAMethod>("SMS");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMFA((event.target as HTMLInputElement).value as MFAMethod);
  };

  useEffect(() => {
    console.log({ token });
    if (token) {
      navigate("/statements/rates");
      console.log({ token });
    }
  }, [token]);

  const handleGetStarted = () => {
    console.log("handleGetStarted");
    if (user) {
      register({
        accountNumber: user.accountNumber?.toString(),
        tempPassword: user.tempPassword,
        phone: user.phone,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
        defaultMFA: mfa,
        emailConfirmed: user.emailConfirmed ? "true" : "false",
        phoneNumberConfirmed: user.phoneNumberConfirmed ? "true" : "false",
        PhoneCountryCode: user.phoneCountryCode,
        PhoneExcludingCountryCode: user.phoneExcludingCountryCode
      } as RegistrationRequestDto);
    }
  };


  return (
    <div role="form">
      <div className="registration__subtitle" dangerouslySetInnerHTML={{ __html: t("SIGN_UP.MFA_INFO") }}></div>
      <form className="registration__form">
        <div className="registration__input-container mfa-options">
          <FormControl>

            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="optOption"
              value={mfa}
              onChange={handleChange}
            >

              <Grid container spacing={1}>
                <Grid size={6}>
                  <FormControlLabel
                    className="mfa-optgions__label"
                    value={MFA_SMS}
                    control={<Radio />}
                    label={t("MFA.TYPES.SMS_OTP")}
                  />
                </Grid>
                <Grid size={6}>
                  <FormControlLabel
                    className="mfa-optgions__label"
                    value={MFA_EMAIL}
                    control={<Radio />}
                    label={t("MFA.TYPES.EMAIL_OTP")}
                  />
                </Grid>
                <Grid size={12}>
                  <FormControlLabel
                    className="mfa-optgions__label"
                    value={MFA_NONE}
                    control={<Radio />}
                    label={t("MFA.TYPES.NO_OTP")}
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
        </div>
      </form>
      <button
        type="submit"
        className="button-primary registration__button"
        role="button"
        onClick={handleGetStarted}
      >
        {t("SIGN_UP.BUTTONS.GET_STARTED")}
      </button>
      <Link
        className="button-secondary back-btn registration__back"
        to="/registration/step2"
      >
        {t("BUTTONS.BACK")}
      </Link>

    </div>
  );
};
