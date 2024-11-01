
import React, { useEffect, useState } from "react";
import './cookie.component.scss';
import { useTranslation } from "react-i18next";

import backArrow from '../../assets/img/back-arrow.svg';
import { MainComponent } from "../main/Main.component";
import { useNavigate, useNavigation } from "react-router-dom";

export const CookieComponent = (): JSX.Element => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (<MainComponent ><>
        <div className="page_wrap page_policy">
            <div className="page_wrap_height">
                <header className="page_wrap_height_title policy_title" >
                    <div className="h_title cookie_title"><b > {t('COOKIE_PAGE.SUB_TITLE')}</b><br />
                        <span dangerouslySetInnerHTML={{ __html: t('COOKIE_PAGE.TITLE') }}></span>
                    </div>
                </header>

                <div className="personal_box cookie_box" role="main" dangerouslySetInnerHTML={{ __html: t('COOKIE_PAGE.CONTENT') }}></div>
            </div>
        </div>

        <button onClick={goBack} className="policy_btn_back">
            <span className="img_back_ico">
                <img src={backArrow} />
            </span>
            <span >{t('BUTTONS.BACK')}</span>
        </button>
    </>
    </MainComponent>);

}