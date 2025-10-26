import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";

import { Box } from "@mui/material";

import "./admin.component.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/providers/Auth.provider";
import HeaderComponent from "./components/Headers.component";
import { FooterComponent } from "../main/components/Footer.component";
import { Loading } from "@shared/components/Loading";

export const AdminComponent = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    React.useState<boolean>(false);
  useEffect(() => {
    if (auth.isTokenRecived && !auth.isAuthenticated) {
      navigate("/loginAdmin", { state: { from: location } });
    }
  }, [auth]);

  return (
    <Paper className="admin-container">
      <Loading />
      <HeaderComponent
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <Box
        className="admin-content"
        sx={{ marginLeft: isSidebarCollapsed ? "5.5rem" : "16rem" }}
      >
        <Outlet />
      </Box>
      <FooterComponent
        sx={{ marginLeft: isSidebarCollapsed ? "7.0rem" : "17rem" }}
        showFooter={true}
      />
    </Paper>
  );
};
