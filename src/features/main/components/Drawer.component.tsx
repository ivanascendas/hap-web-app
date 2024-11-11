import { Badge, Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useTranslation } from "react-i18next";
import UserIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import './Drawer.component.scss';
import logo from '../../../assets/img/logo_new_2.png';
import { useSelector } from "react-redux";
import { selectUser } from "../../../shared/redux/slices/authSlice";
import useWindowDimensions from "../../../shared/hooks/useWindowDimensions";
import { forwardRef, useEffect } from "react";
import { selectDepartments } from "../../../shared/redux/slices/departmentsSlice";
import { useGetDepartmentsMutation } from "../../../shared/services/Department.service";
import { useAuth } from "../../../shared/providers/Auth.provider";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUnreadNotificationsCount } from "../../../shared/redux/slices/notificationsSlice";

export type DrawerProps = {
    anchor?: 'left' | 'top' | 'right' | 'bottom';
    open?: boolean;
    onClose?: () => void;
};

export type NavItem = { icon: JSX.Element, url: string }

export const DrawerComponent = forwardRef<HTMLDivElement, DrawerProps>(({
    anchor,
    open,
    onClose,
}: DrawerProps, ref) => {
    const user = useSelector(selectUser);
    const { width } = useWindowDimensions();
    const { isAuthenticated } = useAuth();
    const unreadCount = useSelector(selectUnreadNotificationsCount);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const [getDepartments, result] = useGetDepartmentsMutation();
    const departments = useSelector(selectDepartments);

    const settings = [
        {
            slug: 'messages',
            icon: <Badge badgeContent={unreadCount} color="error"><MailOutlineIcon /></Badge>,
            title: t('MAIN.MENU.MESSAGES')
        },
        {
            slug: 'account',
            icon: <UserIcon />,
            title: t('MAIN.MENU.ACCOUNT')
        },
        {
            slug: 'data',
            icon: <GppMaybeOutlinedIcon />,
            title: t('MAIN.MENU.DATA_POLICY')
        },
        {
            slug: 'contacts',
            icon: <LocalPhoneOutlinedIcon />,
            title: t('MAIN.MENU.CONTACT_US')
        }];

    const departmentsInfo: { [key: string]: { icon: JSX.Element, url: string } } = {
        ['RENTS']: { icon: <LocalAtmOutlinedIcon />, url: "/statements/rents" },
        ['RATES']: { icon: <EuroOutlinedIcon />, url: "/statements/rates" },
        ['LOANS']: { icon: <CreditScoreIcon />, url: "/statements/loans" },
        ['LOAN_INFO']: { icon: <ErrorRoundedIcon />, url: "/statements/loan-info" },
    }

    const handleClick = (url: string) => {
        navigate(url);
        onClose && onClose();
    }

    useEffect(() => {
        if (isAuthenticated && result.isUninitialized && departments.length === 0) {
            getDepartments();
        }
    }, [isAuthenticated, result]);

    return (
        <Drawer
            variant={width > 900 ? "permanent" : undefined}
            anchor="left"
            open={open}
            onClose={onClose}

        >
            <Box ref={ref} sx={{ overflow: 'auto', marginTop: { md: '0px', lg: '77px' } }} className="drawer-container">
                <Toolbar sx={{ height: '77px', display: { md: 'flex', lg: 'none' } }}>
                    <img src={logo} className='logo' alt='logo' style={{ height: '60%', margin: 'auto' }} />
                    <div className="welcome-block">
                        <span className="welcome-text" > {t('APP.WELCOME')}</span><br />
                        <span className="customer-name">{user?.customerName}</span>
                    </div>
                </Toolbar>
                <Divider />
                <List>
                    {departments?.map(s => (
                        <ListItem key={s.incDept} disablePadding>
                            <ListItemButton selected={
                                location.pathname.includes(departmentsInfo[s.incDept].url)
                            } onClick={() => handleClick(departmentsInfo[s.incDept].url)}>
                                <ListItemIcon>
                                    {departmentsInfo[s.incDept].icon}
                                </ListItemIcon>
                                <ListItemText primary={t(`MAIN.MENU.${s.incDept}`)} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <ListItemButton onClick={() => handleClick('/statements/loan-info')} selected={location.pathname.includes(`/statements/loan-info`)}>
                            <ListItemIcon>
                                <ErrorRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`MAIN.MENU.LOAN_INFO`)} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleClick('/statements/documents')} selected={location.pathname.includes(`/statements/documents`)}>
                            <ListItemIcon>
                                <PictureAsPdfOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`MAIN.MENU.DOCUMENTS`)} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {settings.map(({ icon, title, slug }) => <ListItem key={title} disablePadding>
                        <ListItemButton onClick={() => handleClick(`/${slug}`)} selected={location.pathname.includes(`/${slug}`)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                    )}
                </List>

            </Box>
            <Box className="drawer-container" sx={{ flex: 1 }} ></Box>
        </Drawer>
    );
});