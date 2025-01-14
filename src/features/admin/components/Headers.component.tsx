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
import logo from "../../../assets/img/logo_new_2.png";
import { selectUser } from "../../../shared/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const pages = ["Users", "Letters", "Reports", "Notifications", "Admins"];
const settings = ["Security", "Messages", "Terms", "Logout"];

const HeaderComponent = (): JSX.Element => {
  const [adminName, setAdminName] = React.useState<string>("Admin");
  const user = useSelector(selectUser);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page?: string) => {
    if (page) {
      switch (page) {
        case "Users":
          break;
        case "Letters":
          break;
        case "Reports":
          break;
        case "Notifications":
          break;
        case "Admins":
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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <NavLink to={`/admin/${page.toLowerCase()}`}>{page}</NavLink>
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
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",

              marginLeft: "2rem",
            }}
          >
            ADMIN
          </Typography>
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            component={"nav"}
          >
            {pages.map((page) => (
              <NavLink
                to={`/admin/${page.toLowerCase()}`}
                key={page}
                onClick={() => handleCloseNavMenu(page)}
              >
                {page}
              </NavLink>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={adminName} src="/static/images/avatar/2.jpg" />
              </IconButton>
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
      </Container>
    </AppBar>
  );
};

export default HeaderComponent;
