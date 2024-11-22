import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export type OTPConfirmPopupProps = {
    open: boolean;
    onClose?: () => void;
};

export const OTPConfirmPopupComponent = ({ open, onClose }: OTPConfirmPopupProps): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string>('');
    const [otpError, setOtpError] = useState<string>('');

    return (<Modal open={open} onClose={onClose} >
        <Box  >
            <Box>
                <Typography variant='h6' component='h2' gutterBottom > {t('account:otpConfirmPopup.title')} </Typography>
                <Typography variant='body2' gutterBottom > {t('account:otpConfirmPopup.description')} </Typography>
            </Box>

        </Box>
    </Modal>);
}