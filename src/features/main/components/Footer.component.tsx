import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type FooterProps = {
  drawerWidth?: number;
  isAuthenticated?: boolean;
};

export const FooterCompoment = ({
  drawerWidth,
  isAuthenticated,
}: FooterProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        left: {
          md: "0px",
          lg: isAuthenticated ? `${drawerWidth}px` : "0px",
        },
      }}
      className={isAuthenticated ? "authenticated" : undefined}
    >
      {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}
      <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
    </Box>
  );
};
