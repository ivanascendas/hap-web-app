import React, { useEffect, useRef } from "react";
import "./main.component.scss";
import { Loading } from "@shared/components/Loading";
import { CookieBannerComponent } from "./components/CookieBanner.component";
import { useAuth } from "@shared/providers/Auth.provider";
import { HeaderComponent } from "./components/Header.component";
import { DrawerComponent } from "./components/Drawer.component";
import { Box, Modal, Paper } from "@mui/material";
import { BottomBarСomponent } from "./components/BottomBar.component";
import useWindowDimensions from "@shared/hooks/useWindowDimensions";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { FooterCompoment } from "./components/Footer.component";
import { ExistingTenantPopupComponent } from "@shared/components/ExistingTenantPopup.component";
import { useSelector } from "react-redux";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import { selectUser } from "@shared/redux/slices/authSlice";
import { NotificationComponent } from "@shared/components/Notification.component";
import { ContactsComponent } from "@components/contacts/Contacts.component";
import { set } from "react-hook-form";
export type MainProps = {
  children: JSX.Element;
  showFooter?: boolean;
};

export const MainComponent = ({
  children,
  showFooter,
}: MainProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = React.useState(false);
  const isLoading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);
  const [popup, setPopup] = React.useState(false);
  const [openExistingTenantPopup, setOpenExistingTenantPopup] =
    React.useState(false);
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

  useEffect(() => {
    if (!openExistingTenantPopup && isAuthenticated && !isLoading && user) {
      setOpenExistingTenantPopup(
        !user.emailConfirmed || !user.phoneNumberConfirmed,
      );
    }
  }, [isLoading, user]);
  // console.trace();
  return (
    <Paper
      square
      className={`page theme-soft-gray ${isAuthenticated ? "authenticated" : ""}`}
    >
      {!isAuthenticated && (
        <header>
          <Loading />
        </header>
      )}
      {isAuthenticated && !window.location.pathname.startsWith("/invoices") && (
        <HeaderComponent toogleDrawer={openMenuDrawer}>
          {isAuthenticated && <Loading />}
        </HeaderComponent>
      )}
      {isAuthenticated && window.location.pathname.startsWith("/invoices") && (
        <HeaderComponent
          onBack={() => {
            navigate(-1);
          }}
          title={t("INVOICES.RATES.TITLE")}
        >
          {isAuthenticated && <Loading />}
        </HeaderComponent>
      )}
      {isAuthenticated && (
        <DrawerComponent
          ref={drawerRef}
          open={openMenu}
          onClose={openMenuDrawer}
          openContactPopup={() => {
            setPopup(true);
            setOpenMenu(false);
          }}
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
      {showFooter === true && (
        <FooterCompoment
          drawerWidth={drawerWidth}
          isAuthenticated={isAuthenticated}
          showFooter={
            !window.location.pathname.startsWith("/invoices") &&
            !window.location.pathname.startsWith("/payment")
          }
        />
      )}

      <CookieBannerComponent />
      {isAuthenticated && (
        <ExistingTenantPopupComponent
          open={openExistingTenantPopup}
          onClose={() => setOpenExistingTenantPopup(false)}
        />
      )}
      <NotificationComponent />
      {popup && (
        <Modal open={popup} onClose={() => setPopup(false)}>
          <ContactsComponent onClose={() => setPopup(false)} />
        </Modal>
      )}
    </Paper>
  );
};
