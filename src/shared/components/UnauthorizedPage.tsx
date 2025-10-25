import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useTranslation } from "react-i18next";

/**
 * Unauthorized page component displayed when user doesn't have required permissions
 */
export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <LockIcon
          sx={{
            fontSize: 100,
            color: "error.main",
            opacity: 0.7,
          }}
        />

        <Typography variant="h3" component="h1" gutterBottom>
          {t("UNAUTHORIZED.TITLE") || "Access Denied"}
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          {t("UNAUTHORIZED.MESSAGE") ||
            "You don't have permission to access this page."}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {t("UNAUTHORIZED.DESCRIPTION") ||
            "If you believe this is an error, please contact your administrator."}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoBack}
            size="large"
          >
            {t("UNAUTHORIZED.GO_BACK") || "Go Back"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            size="large"
          >
            {t("UNAUTHORIZED.GO_HOME") || "Go to Home"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
