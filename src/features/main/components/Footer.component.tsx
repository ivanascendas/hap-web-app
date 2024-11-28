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
    <footer
      role="contentinfo"
      style={{ left: `${drawerWidth}px` }}
      className={isAuthenticated ? "authenticated" : undefined}
    >
      {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}
      <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
    </footer>
  );
};
