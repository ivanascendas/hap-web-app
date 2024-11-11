import { Box, Modal, Typography } from "@mui/material";
import { NotificationDto } from "../../../shared/dtos/messages.dtos";
import CloseIcon from '@mui/icons-material/Close';

import moment from "moment";
import { useMarkAsReadMutation } from "../../../shared/services/Notifications.service";
import { useEffect } from "react";

export type MessageItemProps = {
    open: boolean;
    onClose: () => void;
    message: NotificationDto;
}
export const MessagePopupComponent = ({ message, open, onClose }: MessageItemProps): JSX.Element => {
    const [markAsRead] = useMarkAsReadMutation();

    useEffect(() => {
        if (open && message) {
            markAsRead([message.notificationId]);
        }
    }, [open, message]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby={message.title}
            aria-describedby={message.message}
        >
            <Box key={message.notificationId} className="popup message message_popup" >
                <Typography variant="h6" component='div' className="message_title">
                    <span>{message.title}</span>

                    <CloseIcon className="message_icon" onClick={onClose} />
                </Typography>
                <Typography variant="body1" className="message_body">
                    <Typography variant="body2" className="message_date">
                        {moment(message.sentDate).format('DD MMM YYYY ')}
                    </Typography>
                    {message.message}
                </Typography>

            </Box>
        </Modal>
    );
}
