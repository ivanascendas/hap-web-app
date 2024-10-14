import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { MFAMethod } from "../../../../shared/dtos/user.dto";
import Grid from "@mui/material/Grid2";

import { useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
export const RegMfaFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const MFA_SMS: MFAMethod = "SMS";
  const MFA_EMAIL: MFAMethod = "Email";
  const MFA_NONE: MFAMethod = "None";

  const [mfa, setMFA] = useState<MFAMethod>("SMS");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMFA((event.target as HTMLInputElement).value as MFAMethod);
  };

  const handleGetStarted = () => {
    console.log("handleGetStarted");
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

        <button
          type="submit"
          className="button-primary registration__button"
          role="button"
          onClick={handleGetStarted}
        >
          {t("SIGN_UP.BUTTONS.GET_STARTED")}
        </button>
      </form>
    </div>
  );
};
