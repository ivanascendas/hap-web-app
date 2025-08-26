import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "./Headers.component.scss";
import logo from "../../../../assets/img/HAP2.png";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Badge, Button, Drawer } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useLogoutMutation } from "@shared/services/Auth.service";

const pages = [
  { link: "users", title: "Users", icon: <PeopleIcon /> },
  { link: "letters/InvitationLetter", title: "Letters", icon: <MailIcon /> },
  { link: "reports", title: "Reports", icon: <AssessmentIcon /> },
  {
    link: "notifications/forms",
    title: "Notifications",
    icon: <NotificationsIcon />,
  },
  { link: "admins", title: "Admins", icon: <AdminPanelSettingsIcon /> },
];

const settings = ["Security", "Messages", "Logout"];

const HeaderComponent = (): JSX.Element => {
  const [title, setTitle] = React.useState<string>("ADMIN.USERS.TITLE");

  const location = useLocation();
  const { t } = useTranslation();
  const [adminName, setAdminName] = React.useState<string>("Admin");
  const [unreadCount, setUnreadCount] = React.useState<number>(10);
  const user = useSelector(selectUser);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const [logout] = useLogoutMutation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page?: string) => {
    if (page) {
      switch (page) {
        case "users":
          setTitle("ADMIN.USERS.TITLE");
          break;
        case "letters":
          setTitle("ADMIN.LETTERS.TITLE");
          break;
        case "reports":
          setTitle("Reports");
          break;
        case "notifications":
          setTitle("Notifications");
          break;
        case "admins":
          setTitle("ADMIN.MANAGEMENT.TITLE");
          break;
        default:
          console.warn(`Unknown page: ${page}`);
          break;
      }
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting?: string) => {
    if (setting) {
      switch (setting) {
        case "Security":
          break;
        case "Messages":
          break;
        case "Terms":
          break;
        case "Logout":
          logout();
          break;
        default:
          break;
      }
    }
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    if (user) {
      setAdminName(user?.customerName || "Admin");
    }
  }, [user]);

  React.useEffect(() => {
    console.log("Location changed:", location.pathname.split("/")[2]);
    handleCloseNavMenu(location.pathname.split("/")[2]);
  }, [location.pathname]);
  console.log("HeaderComponent rendered with title:", title);
  return (
    <>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "none",
              mr: 1,
              flex: "none",
              justifyItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} className="logo" alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ADMIN
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              onClose={() => handleCloseNavMenu()}
              sx={{ display: "none" }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.link}
                  onClick={() => handleCloseNavMenu(page.title.toLowerCase())}
                >
                  <NavLink to={`/admin/${page.link}`}>{page.title}</NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              flex: "none",
              gap: 2,
            }}
          >
            <img src={logo} className="logo" alt="logo" />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="h5"
            sx={{
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",

              marginLeft: "2rem",
            }}
          >
            {t(title)}
          </Typography>

          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              aria-label={`show ${unreadCount} new notifications`}
              color="inherit"
              onClick={() => handleCloseUserMenu()}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title="Open settings">
              <Button
                startIcon={
                  <Avatar alt={adminName} src="/static/images/avatar/2.jpg" />
                }
                endIcon={
                  <i
                    className="fas fa-chevron-down"
                    style={{ color: "#000000", fontSize: "0.8rem" }}
                  />
                }
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "1.5rem" }}
              >
                <Typography
                  sx={{
                    display: { xs: "none", md: "flex" },
                    ml: 1,
                    color: "#000000",
                    textTransform: "none",
                  }}
                >
                  {adminName}
                </Typography>
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
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
              onClose={() => handleCloseUserMenu()}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  {setting !== "Logout" ? (
                    <NavLink to={`/admin/${setting.toLowerCase()}`}>
                      {" "}
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </NavLink>
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant={"permanent"} anchor="left">
        <Box
          className="drawer-admin"
          sx={{ width: 250 }}
          onClick={() => setAnchorElNav(null)}
          onKeyDown={() => setAnchorElNav(null)}
        >
          <img src={logo} className="logo" alt="logo" />
          {pages.map((page) => (
            <MenuItem
              key={page.link}
              onClick={() => handleCloseNavMenu(page.title)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NavLink to={`/admin/${page.link}`}>
                  {React.cloneElement(page.icon, {
                    sx: { color: "inherit" },
                    marginRight: "0.5rem",
                  })}
                  &nbsp;
                  {page.title}
                </NavLink>
              </Box>
            </MenuItem>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "start",
              marginBottom: "1rem",
              marginLeft: "1rem",
            }}
          >
            <Button
              startIcon={<LogoutIcon />}
              onClick={() => handleCloseUserMenu("Logout")}
            >
              <Typography sx={{ textTransform: "none" }}>Logout</Typography>
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default HeaderComponent;
