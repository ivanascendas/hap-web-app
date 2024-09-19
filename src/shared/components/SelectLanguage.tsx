import React from "react";
import { useTranslation } from "react-i18next";

export const SelectLanguage = (): JSX.Element => {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="gb">English</option>
      <option value="ie">Gaeilge</option>
    </select>
  );
};
