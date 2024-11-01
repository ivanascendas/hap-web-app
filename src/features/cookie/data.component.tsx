
import React, { useEffect, useState } from "react";
import './cookie.component.scss';
import { useTranslation } from "react-i18next";

import backArrow from '../../assets/img/back-arrow.svg';
import { MainComponent } from "../main/Main.component";
import { useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../shared/providers/Auth.provider";

/**
 * DataComponent is a React functional component that displays the Data Protection Statement
 * for the HAP WebPay Portal. It uses the `useTranslation` hook for internationalization and 
 * the `useAuth` hook to check if the user is authenticated. If the user is not authenticated, 
 * a back button is displayed to navigate to the previous page.
 *
 * @returns {JSX.Element} The rendered Data Protection Statement component.
 */
export const DataComponent = (): JSX.Element => {
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (<MainComponent ><>
        <div className="page_wrap page_policy data-policy-info">
            <div className="page_wrap_height">
                <div className="page_wrap_height_title policy_title">
                    <div className="h_title cookie_title"><b>Data Protection Statement for</b><br />
                        <span>HAP WebPay Portal</span>
                    </div>
                </div>

                <div className="personal_box cookie_box">

                    <h2>Introduction</h2>
                    <p>This data protection statement has been created for the Housing Assistance Payment (“HAP”) WebPay portal (WebPay”).</p>

                    <h2>Who we are and why do we require your information?</h2>
                    <p>The HAP Scheme is a social housing support scheme, established by the Government of Ireland within the Department of Housing, Local Government and Heritage (the “DHLGH”). The DHPLG in conjunction with the Local Authorities of Ireland are the data controllers for the HAP scheme.</p>
                    <p>The data controllers established the Housing Assistance Payment Shared Service Centre (“HAP SSC”), to provide specific financial transactional and reporting services on behalf of all Local Authorities and the DHLGH.</p>
                    <p>The HAP SSC is part of Limerick City and County Council and acts as a data processor for the data controllers.</p>
                    <p>The WebPay portal has been created as a way for people who are participating in HAP to view the transactions in their account with their Local Authority and to make online payments.</p>

                    <h2>Why do we have a data protection statement?</h2>
                    <p>HAP SSC has created this data protection statement in order to demonstrate our firm commitment to data protection and to assure you that in all your dealings with HAP SSC that we will ensure the security of the data you provide to us. HAP SSC creates, collects and processes a significant amount of personal data in various multiple formats on a daily basis. HAP SSC’s commitment is that the personal data you may be required to supply is:</p>
                    <ul>
                        <li>Obtained lawfully, fairly and in a transparent manner</li>
                        <li>Obtained for only specified, explicit and legitimate purposes</li>
                        <li>Adequate, relevant and limited to what is necessary for purpose for which it was obtained</li>
                        <li>Recorded, stored accurately and securely and where necessary kept up to date</li>
                        <li>Kept only for as long as is necessary for the purposes for which it was obtained</li>
                        <li>Kept in a form which permits identification of the data subject</li>
                        <li>Processed only in a manner that ensures the appropriate security of the personal data including protection against unauthorised or unlawful processing</li>
                    </ul>

                    <h2>Data Protection Policy</h2>
                    <p>HAP SSC has a detailed Data Protection Policy which outlines how we as a public body are committed to ensuring the security of any personal data you provide to us.</p>

                    <h2>What is the activity referred to in this Data Protection Statement?</h2>
                    <p>The HAP SSC, as data processor, needs to process certain personal data in order to provide the WebPay portal. If you wish to make a card payment within the WebPay portal then you will need to provide card details to our card payment partner.</p>
                    <p>The WebPay portal will validate the email address that you use and may be used to communicate with you concerning your HAP account.</p>

                    <h2>What is the basis for making the processing of personal data in this activity lawful?</h2>
                    <p>The processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller (Article 6(e) GDPR); the official authority is based on </p>
                    <ul>
                        <li>Part 4 Housing (Miscellaneous Provisions) Act 2014 </li>
                        <li>Section 149(A) Local Government Acts 2001 to 2014</li>
                        <li>Housing Authorities Functions under the Housing Acts 1966 to 2014</li>
                    </ul>
                    <p>The Data Controllers have concluded a Data Processing Agreement with Limerick City and County Council – HAP SSC, as the Data Processor. A separate data sharing agreement has been concluded with Global Payments Inc trading as Realex Payments. Realex Payments act as a data controller and are responsible for processing your card payments.</p>

                    <h2>What personal data will be processed within the WebPay portal?</h2>
                    <p>In order to provide the WebPay portal service the following personal data will be transferred securely from the existing systems of HAP SSC</p>
                    <ul>
                        <li>Name</li>
                        <li>Customer number</li>
                        <li>Customer pin</li>
                        <li>Customer password</li>
                        <li>Address including Eircode</li>
                        <li>Email</li>
                        <li>Mobile telephone number</li>
                        <li>Customer balance</li>
                        <li>Transactions</li>
                        <li>Messages</li>
                        <li>Receipts</li>
                    </ul>
                    <p>The WebPay portal can be used to make card payments. These payments can be either credit or debit card. If you choose to use this option then you will be transferred to the website of our card payment partner, Realex Payments. The WebPay portal will pass sufficient information to Realex Payments to allow them to identify you, including</p>
                    <ul>
                        <li>Customer name</li>
                        <li>Customer number</li>
                        <li>Customer address</li>
                        <li>Mobile telephone number</li>
                        <li>Email</li>
                        <li>Address including Eircode</li>
                    </ul>
                    <p>Realex Payments will securely process your card payment, including</p>
                    <ul>
                        <li>Name on your payment card</li>
                        <li>Number of your payment</li>
                        <li>payment card expiry date</li>
                        <li>Card Verification Value (“CVV”) number – this is the 3 digit number on your card, and </li>
                        <li>Payment amount</li>
                        <li>Currency</li>
                    </ul>
                    <p>Your payment card details will not be shared with your Local Authority or with HAP SSC. Once Realex Payments have confirmed the transaction, the receipt details (amount and status) will be passed back to the WebPay portal and saved. Your receipt will then be transferred back to your account in the financial records of HAP SSC.</p>
                    <p>The WebPay portal also uses cookies and you can find out more about how cookies work in the WebPay portal by looking at our WebPay portal cookie statement.</p>


                    <h2>Is the personal data submitted as part of this activity shared with other organisations?</h2>
                    <p>The receipt transaction created when you make a card payment will be stored in the WebPay Portal. The receipts transactions will be written back to our main financial systems and stored as part of your account history. Your card payment information is not stored within the WebPay portal.</p>
                    <p>Your account history will be available to other public bodies where processing is necessary for compliance with a legal obligation to which the data controller is subject. This may include your Local Authority and the Department of Housing, Planning and Local Government.</p>
                    <p>Other secondary controllers and processors to carry out processing on behalf of the data controller e.g. ICT support contractors i.e. Realex Payments and Ascendas Business Solutions.</p>
                    <p>In this activity, if the personal data is to be transferred to a different country, it will be transferred to the following countries (if there are no countries listed, it is not intended to transfer the personal data abroad).</p>
                    <ul>
                        <li>Realex Payments is a brand of Global Payments Inc., a multinational business headquartered in the United States. Realex Payments are a data controller and further information about their data processing and any international data transfers are provided on Realex Payments own websites.</li>
                    </ul>

                    <h2>How long is this personal data held by HAP SSC?</h2>
                    <p>The HAP SSC will only retain your personal data as determined by the data controllers for as long as it is necessary for the purposes for which they were collected and subsequently processed, and in line with certain statutory requirements, where relevant.</p>
                    <p>The data controller will advise when the personal data is no longer required and instruct the HAP SSC to destroy or delete it in a secure manner.</p>
                    <p>The data processed as part of this activity will be retained for the following period(s):<br />
                        Records are to be maintained in line with the Data Controllers records management policy.</p>


                    <h2>What will happen if the requested personal data is not provided?</h2>
                    <p>It will not be possible to provide you with the card payment service in the WebPay portal if you do not wish to provide your name, contact details and your card number, expiry date and CVV. Local Authorities and HAP SSC provide a number of other payment options. You can get more information about payment options at our website - <a href="http://hap.ie/tenants/weeklyrentcontribution/">http://hap.ie/tenants/weeklyrentcontribution/</a>.</p>


                    <h2>Further information</h2>
                    <p>You can obtain further information about </p>
                    <ul>
                        <li>the HAP Scheme at our website; <a href="www.hap.ie">www.hap.ie</a>.</li>
                        <li>contact details for each Local Authority; <a href="www.hap.ie/localauthorities/">www.hap.ie/localauthorities/</a></li>
                        <li>the data processing carried out by the HAP SSC; <a href="www.hap.ie/privacy">www.hap.ie/privacy</a></li>
                        <li>the data processing carried out by Limerick City and County Council; <a href="www.limerick.ie/council/services/your-council/privacy-statement-limerick-city-and-county-council">www.limerick.ie/council/services/your-council/privacy-statement-limerick-city-and-county-council</a></li>
                    </ul>


                    <h2>Your Data Protection Rights</h2>
                    <p>To the extent that the HAP SSC as Data Processor processes your personal data for or on behalf of the Data Controllers, the Data Processor undertakes to notify the relevant Data Controller if it receives any complaint, notice or communication which relates directly or indirectly to the processing of your personal data or to compliance with applicable Data Protection Law and provide the Data Controller with full co-operation and assistance in relation to any such complaint, notice or communication.
                        The HAP SSC as Data Processor can provide you with the relevant contact details for your relevant Local Authority (Data Controller).
                    </p>
                    <p>You have the right to request access to personal data held about you, obtain confirmation as to whether data concerning you exists, be informed of the content and source of data and check its accuracy. In addition, if the data held by us is found to be inaccurate you have the right to change, remove, block, or object to the use of, personal data held by your Local Authority, which is shared with HAP SSC. You also have the right to data portability. In certain circumstances blocking access to data may delay or remove access to a service where the data is required by law or for essential purposes related to delivery of a service to you. To exercise these rights, you should contact HAP SSC at the following address:</p>
                    <p className="align-center">email: <a href="mailto:dataprotectionofficer@limerick.ie">dataprotectionofficer@limerick.ie</a><br />
                        Data Protection Officer,<br />
                        Limerick City and County Council,<br />
                        Merchants Quay,<br />
                        Limerick</p>

                    <h2>Right of Complaint to the Data Protection Commission</h2>
                    <p>If you are not satisfied with the outcome of the response you received from HAP SSC in relation to your request, then you are entitled to make a complaint to the Data Protection Commission who may investigate the matter for you.</p>
                    <p>The Data Protection Commission’s website is www.dataprotection.ie or you can contact their office at:</p>
                    <p className="align-center">Lo Call Number: 1890 252 231<br />
                        E-mail: <a href="mailto:info@dataprotection.ie">info@dataprotection.ie</a><br /><br />
                        Postal Address:<br />
                        Data Protection Commission<br />
                        Canal House<br />
                        Station Road<br />
                        Portarlington<br />
                        Co. Laois. R32 AP23</p>
                    <p>Last updated December 2020</p>
                </div>
            </div>
        </div>

        {!isAuthenticated && <button onClick={goBack} className="policy_btn_back">
            <span className="img_back_ico">
                <img src={backArrow} />
            </span>
            <span >{t('BUTTONS.BACK')}</span>
        </button>}
    </>
    </MainComponent>);

}