import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import "./CookieBanner.component.scss";
import StorageService from "../../../shared/services/Storage.service";


export const CookieBannerComponent = (): JSX.Element => {
    const { t } = useTranslation();
    const [showCookie, setShowCookie] = useState(true);
    const setCookie = () => {
        StorageService.setItem("cookieBanner", "true");
        setShowCookie(false);
    };

    useEffect(() => {
        var cookieBanner = StorageService.getItem("cookieBanner") || 'false';
        if (cookieBanner == 'yes') {
            setShowCookie(false);
            StorageService.setItem("cookieBanner", "true");
        } else {
            setShowCookie(cookieBanner !== 'true');
        }
    }, []);

    return showCookie ? (<div className="cookie-banner-container" role="banner">
        <div className="cookie-banner-content">
            <div className="cookie_info">
                <div className="h3">{t('COOKIE.POPUP.TITLE')}</div>
                <p className="coockie_info__p" dangerouslySetInnerHTML={{ __html: t('COOKIE.POPUP.CONTENT') }} />
            </div>
            <div className="cookie-banner-buttons-container">
                <button onClick={setCookie} className="cookie-banner-buttons " >{t('COOKIE.POPUP.GOT_IT')}</button>
            </div>
        </div>
    </div >) : <></>;
}