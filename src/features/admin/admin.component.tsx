import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";

import { Box } from "@mui/material";

import "./admin.component.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/providers/Auth.provider";
import HeaderComponent from "./components/Headers.component";
import { FooterCompoment } from "../main/components/Footer.component";
import { Loading } from "../../shared/components/Loading";
import { NotificationComponent } from "../../shared/components/Notification.component";

export const AdminComponent = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isTokenRecived && !auth.isAuthenticated) {
      navigate("/loginAdmin", { state: { from: location } });
    }
  }, [auth]);

  return (
    <Paper className="admin-container">
      <Loading />
      <HeaderComponent />
      <NotificationComponent />
      <Box className="admin-content">
        <Outlet />
      </Box>
      <FooterCompoment showFooter={true} />
    </Paper>
  );
};
