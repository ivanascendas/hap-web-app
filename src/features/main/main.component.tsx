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
export type MainProps = {
  children: JSX.Element;
};

export const MainComponent = ({
  children,
}: MainProps): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = React.useState(false);
  const { width } = useWindowDimensions();
  const [drawerWidth, setDrawerWidth] = React.useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const openMenuDrawer = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (drawerRef.current) {
      setDrawerWidth(drawerRef.current.offsetWidth);
    }
  }, [openMenu, drawerRef.current, width]);


  return (

    <Paper square className="page">
      <Loading />
      {isAuthenticated && <HeaderComponent toogleDrawer={openMenuDrawer} />}
      {isAuthenticated && <DrawerComponent ref={drawerRef} open={openMenu} onClose={openMenuDrawer} />}
      <Box sx={{ marginLeft: { md: '0px', lg: isAuthenticated ? `${drawerWidth}px` : '0px' } }} className="main-container">{children}</Box>
      {isAuthenticated && <BottomBarСomponent />}
      <CookieBannerComponent />
    </Paper>

  );
};