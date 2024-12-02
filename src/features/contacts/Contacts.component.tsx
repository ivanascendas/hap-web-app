import React from "react";
import "./Contacts.component.scss";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../shared/redux/slices/authSlice";

export const ContactsComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  return (
    <Box sx={{ flexGrow: 1 }} className=" contact-us">
      <Box className=" personal_box contact-info-block">
        <Box className="title">
          <h1>{t("CONTACT_US.TITLE")}</h1>
        </Box>
        <Box>
          {t("CONTACT_US.PHONE")}: <a href="tel:061 556600">061 556600</a>
        </Box>

        <Box>
          {t("CONTACT_US.EMAIL")}:{" "}
          <a
            href={`mailto:Hapcollections@limerick.ie?subject=HAP ID ${user?.customerNo}`}
          >
            Hapcollections@limerick.ie
          </a>
        </Box>
      </Box>
    </Box>
  );
};
