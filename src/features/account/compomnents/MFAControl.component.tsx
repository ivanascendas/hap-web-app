import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MFAMethod } from "../../../shared/dtos/user.dto";

export const MFAControlComponent = (props: RadioGroupProps) => {
  const [mfa, setMfa] = useState<MFAMethod>(props.defaultValue || "None");
  const { t } = useTranslation();
  useEffect(() => {
    if (props.defaultValue) {
      setMfa(props.defaultValue as MFAMethod);
    }
  }, [props]);
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-userdata-label">
        {t("MFA.INFO")}
      </FormLabel>

      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-userdata-label"
        {...props}
        value={mfa}
      >
        <FormControlLabel
          value="SMS"
          control={<Radio />}
          label={t("MFA.TYPES.SMS_OTP")}
        />
        <FormControlLabel
          value="Email"
          control={<Radio />}
          label={t("MFA.TYPES.EMAIL_OTP")}
        />
        <FormControlLabel
          value="None"
          control={<Radio />}
          label={t("MFA.TYPES.NO_OTP")}
        />
      </RadioGroup>
    </FormControl>
  );
};
