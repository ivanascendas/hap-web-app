import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { MFAMethod } from "../../../shared/dtos/user.dto";
import { OtpInputComponent } from "../../../shared/components/otpInput.component";
import { selectLoginResponse, selectMaskedValue, useLoginMutation, useLoginWithCodeMutation } from "../../../shared/services/Auth.service";
import { TokenDto } from "../../../shared/dtos/token.dto";
import { selectTmpToken, setToken } from "../../../shared/redux/slices/authSlice";

export type MfaLoginProps = {
    username: string;
    password: string;
    mfa: MFAMethod;
};

export const MfaLogin = ({ username, password, mfa }: MfaLoginProps): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [login] = useLoginMutation();
    const [loginWithCode, result] = useLoginWithCodeMutation();

    const data: TokenDto | null = useSelector(selectTmpToken);
    const maskeedValue = useSelector(selectMaskedValue);
    const [mfaMethod, setMFA] = useState<MFAMethod>(mfa);
    const [showAnotherWay, setShowAnotherWay] = useState(false);

    const handleChangeMFA = () => {
        login({ username, password, mfaMethod });
        setShowAnotherWay(false);
    };

    const handleLoginWithCode = (code: string) => {
        loginWithCode({ code, token: data?.access_token as string, mfaMethod });

    };
    console.log({ data });
    useEffect(() => {
        if (result.isSuccess) {
            dispatch(setToken(result.data));
            navigate("/statements");
            console.log({ result });
        }
    }, [result]);

    return (
        <div className="mfa-login">

            <div className="mfa-login__info">{t('MFA.ENTER_INFO')}</div>
            {showAnotherWay ? <>
                <label className="mfa-login__label">{t('MFA.CHOOSE_MFA')}</label>
                <div className="mfa-ways">
                    <label>
                        <input type="radio" name="optOption" onClick={(e) => setMFA((e.target as HTMLInputElement).value as MFAMethod)} value="SMS" />
                        <span >{`${t('MFA.SEND_TO')} ${data?.phoneNumber}`}</span>
                    </label>
                    <label>
                        <input type="radio" name="optOption" onClick={(e) => setMFA((e.target as HTMLInputElement).value as MFAMethod)} value="Email" />
                        <span >{`${t('MFA.SEND_TO')} ${data?.email}`}</span>
                    </label>
                    <button type="submit" className="button-primary mt-20" onClick={handleChangeMFA} >Send OTP</button>
                </div>
            </> : <>
                <label className="mfa-login__label">{maskeedValue}</label>
                <OtpInputComponent
                    btnLabel={t("BUTTONS.CHECK")}
                    resendLabel={t("MFA.VERIFICATION_INPUT.RESEND_OTP")}
                    extraLinnk={t('MFA.VERIFICATION_INPUT.TRY_ANOTHER_WAY')}
                    onExtraLinkClick={() => setShowAnotherWay(true)}
                    onResend={handleChangeMFA}
                    onSubmit={handleLoginWithCode}
                />
            </>}
        </div>
    );
}

