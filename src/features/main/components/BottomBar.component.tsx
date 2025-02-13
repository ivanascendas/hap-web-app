import React, { useContext } from "react";
import {
  AppBar,
  Badge,
  Box,
  Container,
  Fab,
  IconButton,
  Paper,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "../main.component.scss";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLogoutMutation } from "../../../shared/services/Auth.service";
import { useSelector } from "react-redux";
import { selectUnreadNotificationsCount } from "../../../shared/redux/slices/notificationsSlice";

export const BottomBarСomponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { department } = useParams();
  const unreadCount = useSelector(selectUnreadNotificationsCount);
  const [logout] = useLogoutMutation();
  const StyledFab = styled(Fab)({
    position: "relative",
    zIndex: 1,
    top: -45,
    left: 0,
    right: 0,
    margin: "0 auto",
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", sm: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        width: "100%",
        left: 0,
        right: 0,
      }}
    >
      <AppBar
        component="nav"
        position="fixed"
        color="primary"
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar className="mobile-menu">
          <IconButton
            color="inherit"
            className={`mobile-menu__item ${location.pathname.startsWith("/statements") ? "active" : ""}`}
            onClick={() => navigate("/statements/rates")}
            aria-label={t("CONTENTS.NAV.STATEMENT")}
          >
            <MenuIcon />
            <Typography variant="h6" noWrap component="div">
              {t("CONTENTS.NAV.STATEMENT")}
            </Typography>
          </IconButton>
          <IconButton
            color="inherit"
            className={`mobile-menu__item ${location.pathname.startsWith("/messages") ? "active" : ""}`}
            onClick={() => navigate("/messages")}
            aria-label={t("CONTENTS.NAV.MESSAGES")}
          >
            <Badge badgeContent={unreadCount} color="error">
              <EmailOutlinedIcon />
            </Badge>
            <Typography variant="h6" noWrap component="div">
              {t("CONTENTS.NAV.MESSAGES")}
            </Typography>
          </IconButton>
          <div
            color="inherit"
            className="mobile-menu__item"
            aria-label={t("CONTENTS.NAV.MAKE_PAYMENT")}
          >
            <StyledFab
              color="secondary"
              aria-label="add"
              onClick={() => navigate(`/invoices/${department || "rates"}`)}
            >
              {t("CONTENTS.NAV.MAKE_PAYMENT")}
            </StyledFab>
          </div>

          <IconButton
            color="inherit"
            onClick={() => navigate("/account")}
            className={`mobile-menu__item ${location.pathname.startsWith("/account") ? "active" : ""}`}
            aria-label={t("CONTENTS.NAV.ACCOUNT")}
          >
            <UserIcon />
            <Typography variant="h6" noWrap component="div">
              {t("CONTENTS.NAV.ACCOUNT")}
            </Typography>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => logout()}
            className="mobile-menu__item"
            aria-label={t("CONTENTS.NAV.EXIT")}
          >
            <ExitToAppIcon />
            <Typography variant="h6" noWrap component="div">
              {t("CONTENTS.NAV.EXIT")}
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
