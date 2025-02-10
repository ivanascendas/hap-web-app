import { Box, Button, TextField, Typography } from "@mui/material";
import { NotificationComponent } from "../../../shared/components/Notification.component";
import {
  useGetTermsQuery,
  useSetTermsMutation,
} from "../../../shared/services/Terms.service";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const TermsComponent = () => {
  const [value, setValue] = useState("");
  const { t } = useTranslation();
  const { data, isSuccess } = useGetTermsQuery();
  const [saveTerms] = useSetTermsMutation();
  useEffect(() => {
    if (isSuccess) {
      setValue(data);
    }
  }, [isSuccess]);

  return (
    <Box>
      <Box className="personal_box " mb="2rem" mt="2rem">
        <Typography variant="h4" mb="2rem" component="h2">
          Trems control
        </Typography>
        <Box>
          <TextField
            multiline
            rows={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Box
            sx={{
              padding: "15px 0 0 0",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => saveTerms(value)}
              variant="contained"
              type="submit"
            >
              {t("BUTTONS.SAVE")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
