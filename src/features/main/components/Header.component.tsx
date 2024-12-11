import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../../shared/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import UserIcon from "@mui/icons-material/Person";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "./Header.component.scss";
import BackIcon from "@mui/icons-material/ArrowBack";
import logo from "../../../assets/img/logo_new_2.png";
import logoTransparent from "../../../assets/img/logo-Transparent.png";
import { useLogoutMutation } from "../../../shared/services/Auth.service";
import { selectUnreadNotificationsCount } from "../../../shared/redux/slices/notificationsSlice";
import { Skeleton } from "@mui/material";

export type HeaderProps = {
  toogleDrawer?: (event?: React.MouseEvent<HTMLElement>) => void;
  onBack?: () => void;
  title?: string;
};

export const HeaderComponent = ({
  toogleDrawer,
  onBack,
  title,
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const unreadCount = useSelector(selectUnreadNotificationsCount);
  const [anchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    //setAnchorElNav(event.currentTarget);
    toogleDrawer?.call(this, event);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    //setAnchorElNav(null);
    toogleDrawer?.call(this);
  };

  const handleCloseUserMenu = (i: number) => {
    switch (i) {
      case 1:
        navigate("/messages");
        break;
      case 0:
      case 2:
        navigate("/account");
        break;
      case 3:
        logout();
        break;
      default:
        break;
    }
    setAnchorElUser(null);
  };

  const settings = [
    t("CONTENTS.NAV.ACCOUNT_INF"),
    t("CONTENTS.NAV.MESSAGES"),
    t("CONTENTS.NAV.CHANGE_PASSWORD"),
    t("CONTENTS.NAV.LOGOUT"),
  ];

  return (
    <AppBar position="static" className="app-header">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flex: "none", display: { md: "flex", lg: "none" } }}>
            {onBack ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-controls="menu-appbar"
                aria-haspopup="false"
                onClick={onBack}
              >
                <BackIcon />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem>
                <IconButton
                  size="large"
                  aria-label={`show ${unreadCount} new notifications`}
                  color="inherit"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "none", md: "none", lg: "flex" },
            }}
          >
            <img src={logo} className="logo" alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="span"
              className="logo-text"
            >
              {t("APP.TITLE3")}
            </Typography>
          </Box>

          {title ? (
            <Box
              className="header-title"
              sx={{ display: { xs: "flex", lg: "none" } }}
            >
              {title}
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: { md: "flex", lg: "none", xl: "none" },
              }}
            >
              <img src={logoTransparent} className="logo-mobile" alt="logo" />
            </Box>
          )}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label={`show ${unreadCount} new notifications`}
              color="inherit"
              onClick={() => handleCloseUserMenu(1)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Button
              className="header_links_pay"
              sx={{ display: title ? "none !important" : "flex" }}
            >
              {t("CONTENTS.NAV.MAKE_PAYMENT")}
            </Button>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flex: "none",
              display: { xs: "none", md: "flex", lg: "none" },
            }}
          >
            <Button
              className="link-element"
              onClick={() => handleCloseUserMenu(3)}
            >
              <ExitToAppIcon />
              <Typography
                sx={{
                  textAlign: "center",
                  marginLeft: 1,
                  textTransform: "none",
                }}
              >
                {t("CONTENTS.NAV.LOGOUT")}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "none", lg: "flex" },
              width: "16.25rem",
            }}
          >
            <div onClick={handleOpenUserMenu} className="welcome-block">
              <span className="welcome-text"> {t("APP.WELCOME")}</span>
              <br />
              <span className="customer-name">
                {user ? (
                  user.customerName
                ) : (
                  <Skeleton
                    aria-label="Customer Name"
                    role="progressbar"
                    width="8rem"
                    height={18}
                  />
                )}
              </span>
            </div>

            <Menu
              sx={{ mt: "2.8125rem" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, i) => (
                <MenuItem key={setting} onClick={() => handleCloseUserMenu(i)}>
                  {i == 0 && <UserIcon />}
                  {i == 1 && <MailOutlineIcon />}
                  {i == 2 && <LockOpenIcon />}
                  {i == 3 && <ExitToAppIcon />}
                  <Typography sx={{ textAlign: "center", marginLeft: 1 }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
