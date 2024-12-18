import React, { useEffect, useRef } from "react";
import "./Main.component.scss";
import { Loading } from "../../shared/components/Loading";
import { CookieBannerComponent } from "./components/CookieBanner.component";
import { useAuth } from "../../shared/providers/Auth.provider";
import { HeaderComponent } from "./components/Header.component";

import { DrawerComponent } from "./components/Drawer.component";
import { Box, Paper } from "@mui/material";
import { BottomBarСomponent } from "./components/BottomBar.component";
import useWindowDimensions from "../../shared/hooks/useWindowDimensions";
import { t } from "i18next";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FooterCompoment } from "./components/Footer.component";
export type MainProps = {
  children: JSX.Element;
};

export const MainComponent = ({ children }: MainProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = React.useState(false);
  const { width } = useWindowDimensions();
  const [drawerWidth, setDrawerWidth] = React.useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const openMenuDrawer = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (drawerRef.current) {
      setDrawerWidth(drawerRef.current.offsetWidth);
    }
  }, [openMenu, drawerRef.current, width]);

  return (
    <Paper square className={`page ${isAuthenticated ? "authenticated" : ""}`}>
      <Loading />
      {isAuthenticated && !window.location.pathname.startsWith("/invoices") && (
        <HeaderComponent toogleDrawer={openMenuDrawer} />
      )}
      {isAuthenticated && window.location.pathname.startsWith("/invoices") && (
        <HeaderComponent
          onBack={() => {
            navigate(-1);
          }}
          title={t("INVOICES.RATES.TITLE")}
        />
      )}
      {isAuthenticated && (
        <DrawerComponent
          ref={drawerRef}
          open={openMenu}
          onClose={openMenuDrawer}
        />
      )}
      <Box
        role="main"
        sx={{
          marginLeft: {
            md: "0px",
            lg: isAuthenticated ? `${drawerWidth}px` : "0px",
          },
        }}
        className="main-container"
      >
        {children}
      </Box>
      <FooterCompoment
        drawerWidth={drawerWidth}
        isAuthenticated={isAuthenticated}
        showFooter={
          !window.location.pathname.startsWith("/invoices") &&
          !window.location.pathname.startsWith("/payment")
        }
      />
      {isAuthenticated &&
        !window.location.pathname.startsWith("/invoices") &&
        !window.location.pathname.startsWith("/payment") && (
          <BottomBarСomponent />
        )}
      <CookieBannerComponent />
    </Paper>
  );
};
