import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useTranslation } from "react-i18next";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import "./Drawer.component.scss";
import styles from "../../../../assets/styles/variables.scss";
import logo from "../../../../assets/img/logo_new_2.png";
import { useSelector } from "react-redux";
import { selectBalance, selectUser } from "@shared/redux/slices/authSlice";
import useWindowDimensions from "@shared/hooks/useWindowDimensions";
import { forwardRef, useEffect } from "react";
import { useLazyUserdataQuery } from "@shared/services/Auth.service";
import { selectDepartments } from "@shared/redux/slices/departmentsSlice";
import { useGetDepartmentsMutation } from "@shared/services/Department.service";
import { useAuth } from "@shared/providers/Auth.provider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectUnreadNotificationsCount } from "@shared/redux/slices/notificationsSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import currency from "@shared/utils/currency";
import { useLazyGetBalanceQuery } from "@shared/services/Statements.service";
import moment from "moment";

export type DrawerProps = {
  anchor?: "left" | "top" | "right" | "bottom";
  open?: boolean;
  onClose?: () => void;
};

export type NavItem = { icon: JSX.Element; url: string };

export const DrawerComponent = forwardRef<HTMLDivElement, DrawerProps>(
  ({ anchor, open, onClose }: DrawerProps, ref) => {
    const user = useSelector(selectUser);

    const balance = useSelector(selectBalance);
    const { width } = useWindowDimensions();
    const { isAuthenticated } = useAuth();
    const unreadCount = useSelector(selectUnreadNotificationsCount);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const [getDepartments, { isLoading: isDepartmentsLoading }] =
      useGetDepartmentsMutation();
    const departments = useSelector(selectDepartments);
    const [getBalance] = useLazyGetBalanceQuery();
    const [fetchUser, { isFetching }] = useLazyUserdataQuery();

    const departmentsInfo: {
      [key: string]: { icon: JSX.Element; url: string };
    } = {
      ["RENTS"]: { icon: <LocalAtmOutlinedIcon />, url: "/statements/rents" },
      ["RATES"]: { icon: <EuroOutlinedIcon />, url: "/statements/rates" },
      ["LOANS"]: { icon: <CreditScoreIcon />, url: "/statements/loans" },
      ["LOAN_INFO"]: {
        icon: <ErrorRoundedIcon />,
        url: "/statements/loan-info",
      },
    };
    // Generate a consistent color based on the name
    const stringToColor = (str: string) => {
      if (!str) return "#757575";
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let color = "#";
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
      }
      return color;
    };
    const handleClick = (url: string) => {
      navigate(url);
      onClose && onClose();
    };

    useEffect(() => {
      if (
        !isFetching &&
        !isDepartmentsLoading &&
        user?.customerName &&
        isAuthenticated &&
        departments.length === 0 &&
        !location.pathname.startsWith("/admin")
      ) {
        console.log("Fetching departments and balance");
        getDepartments();
        getBalance({
          incDept: "RATES",
          PropertyNumber: "0",
          from: moment().startOf("year").format("YYYY-MM-DD"),
          to: moment().format("YYYY-MM-DD"),
        });
      } else {
        if (!user?.customerName && !isFetching) {
          fetchUser();
        }
      }
    }, [
      isAuthenticated,
      isDepartmentsLoading,
      user?.customerName,
      departments,
      location.pathname,
      isFetching,
    ]);

    return (
      <Drawer
        variant={width > 900 ? "permanent" : undefined}
        anchor="left"
        open={open}
        onClose={onClose}
      >
        <nav className="drawer-nav">
          <Box ref={ref} sx={{ overflow: "auto" }} className="drawer-container">
            <Toolbar sx={{ height: "4.8125rem", display: { md: "flex" } }}>
              <img
                src={logo}
                className="logo"
                alt="logo"
                style={{ height: "60%", margin: "auto" }}
              />
              <div className="welcome-block" style={{ display: "none" }}>
                <span className="welcome-text"> {t("APP.WELCOME")}</span>
                <br />
                <span className="customer-name">{user?.customerName}</span>
              </div>
            </Toolbar>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname.includes(
                    departmentsInfo["RATES"].url,
                  )}
                  onClick={() => handleClick(departmentsInfo["RATES"].url)}
                >
                  <ListItemIcon>{departmentsInfo["RATES"].icon}</ListItemIcon>
                  <ListItemText
                    primary={`${t(`MAIN.MENU.RATES`)} ${t("MAIN.STATEMENT")}`}
                  />
                </ListItemButton>
              </ListItem>

              {/*<ListItem
              disablePadding
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <ListItemButton
                onClick={() => handleClick("/statements/loan-info")}
                selected={location.pathname.includes(`/statements/loan-info`)}
              >
                <ListItemIcon>
                  <ErrorRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t(`MAIN.MENU.LOAN_INFO`)} />
              </ListItemButton>
            </ListItem>*/}

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleClick("/statements/documents")}
                  selected={location.pathname.includes(`/statements/documents`)}
                >
                  <ListItemIcon>
                    <PictureAsPdfOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t(`MAIN.MENU.DOCUMENTS`)} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleClick(`/messages`)}
                  selected={location.pathname.includes(`/messages`)}
                >
                  <ListItemIcon>
                    {" "}
                    <MailOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("MAIN.MENU.MESSAGES")} />
                  <div className="unread">
                    {unreadCount < 100 ? unreadCount : "99+"}
                  </div>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <Box className="profile-block">
                  <Box className="user-info">
                    <Avatar
                      alt={user?.customerName}
                      src={undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: false
                          ? "transparent"
                          : stringToColor(user?.customerName || ""),
                        fontSize: 32 * 0.4,
                      }}
                    ></Avatar>
                    <Typography className="user-name">
                      {user?.customerName}
                    </Typography>
                    <IconButton aria-label="More">
                      <ArrowDropDownIcon color="primary" className="active " />
                    </IconButton>
                  </Box>
                  <Box
                    className="personal_box_filter_balance"
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="personal_box_filter_title">
                      {t("INVOICES.RATES.CURRENT_BALANCE")}
                    </span>
                    <span className="personal_box_filter_value label-question">
                      {currency.format(balance?.currentBalance || 0)}
                    </span>
                  </Box>
                  <Button className="btn-secondary" fullWidth>
                    Pay Now
                  </Button>
                </Box>
              </ListItem>
            </List>
            <List sx={{ marginTop: "auto" }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleClick(`/contacts`)}
                  selected={location.pathname.includes(`/contacts`)}
                >
                  <ListItemIcon>
                    <LocalPhoneOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("MAIN.MENU.CONTACT_US")} />
                </ListItemButton>
              </ListItem>
            </List>
            <Box className="drawer-container__footer">
              <Typography variant="body2">
                {" "}
                {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}
              </Typography>
              <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
            </Box>
          </Box>
        </nav>
      </Drawer>
    );
  },
);

DrawerComponent.displayName = "DrawerComponent";
