
import React, { useEffect } from "react";
import './Messages.component.scss';
import './components/MessagePopup.component.scss';
import { Box, Skeleton, TablePagination, Typography } from "@mui/material";
import { useLazyGetNotificationsQuery } from "../../shared/services/Notifications.service";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../shared/redux/slices/authSlice";
import EmailIcon from '@mui/icons-material/Email';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useAuth } from "../../shared/providers/Auth.provider";
import moment from "moment";
import { Message } from "@mui/icons-material";
import { MessagePopupComponent } from "./components/MessagePopup.component";
import { NotificationDto } from "../../shared/dtos/messages.dtos";
import { getSubstringWithLastWord } from "../../shared/utils/string.utils";
import { selectNotifications, selectNotificationsCount } from "../../shared/redux/slices/notificationsSlice";

export const MessagesComponent = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const user = useSelector(selectUser);
    const notifications = useSelector(selectNotifications);
    const totalCount = useSelector(selectNotificationsCount);
    const [getNotificaitons, { isFetching }] = useLazyGetNotificationsQuery();
    const [page, setPage] = React.useState(0);
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [selectedNotification, setSelectedNotification] = React.useState<NotificationDto | null>(null);
    useEffect(() => {
        if (isAuthenticated) {
            const request = getNotificaitons({
                apar_id: user?.accountNumber || parseInt(user?.customerNo || '0'),
                $inlinecount: 'allpages',
                $orderby: 'SentDate desc',
                $skip: (page) * 10,
                $top: 10,
            });

            return () => {
                request.abort();
            }

        }

    }, [isAuthenticated, page]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
    };

    const handleLoadMore = () => {
        setPage(page + 1);
    }

    const showMessagePopup = (message: NotificationDto) => {
        setSelectedNotification(message);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedNotification(null);
    }

    return (<Box sx={{ flexGrow: 1 }} className="messages" >
        <Typography variant="h1" className="messages_header">
            {t('MESSAGE_PAGE.TITLE')}
        </Typography>
        <Box className="personal_box messages_content">
            <Box className="messages_list">
                {!isFetching && notifications.map((item, index) => (
                    <Box key={item.notificationId} className="message" onClick={() => showMessagePopup(item)} tabIndex={-1 * (index + 1)}>
                        <Typography variant="h6" component='div' className="message_title">
                            <span>{item.title}</span>
                            <Typography variant="body2" className="message_date">
                                {moment(item.sentDate).format('DD MMM YYYY ')}
                            </Typography>
                            {!item.isRead ? <EmailIcon className={`message_icon unread`} /> :
                                <DraftsIcon className="message_icon" />}
                        </Typography>
                        <Typography variant="body1" className="message_body">
                            {getSubstringWithLastWord(item.message, 500)}
                        </Typography>

                    </Box>))}
                {isFetching && <Box className="message" tabIndex={-1}>
                    <Typography variant="h6" component='div' className="message_title">
                        <span><Skeleton role="progressbar" aria-label="Message Title" /></span>
                        <Typography variant="body2" className="message_date">
                            <Skeleton role="progressbar" aria-label="Message Date" />
                        </Typography>
                        <DraftsIcon className="message_icon" />
                    </Typography>
                    <Typography variant="body1" className="message_body">
                        <Skeleton aria-label="Message body" role="progressbar" width={'100%'} />
                        <Skeleton aria-label="Message body" role="progressbar" width={'100%'} />
                        <Skeleton aria-label="Message body" role="progressbar" width={'100%'} />
                    </Typography>

                </Box>
                }

            </Box>
            <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={totalCount}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}

            />
        </Box>
        {selectedNotification && <MessagePopupComponent open={open} onClose={handleClose} message={selectedNotification} />}
    </Box>);
};