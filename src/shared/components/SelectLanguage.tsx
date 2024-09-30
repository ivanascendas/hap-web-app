import React from "react";
import { useTranslation } from "react-i18next";

export const SelectLanguage = (): JSX.Element => {
  const { i18n } = useTranslation();
  return (
    <div id="select-language-holder">
      <select
        id="select-language"
        aria-label="Select language"
        aria-labelledby="select-language-holder"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="gb">English</option>
        <option value="ie">Gaeilge</option>
      </select>
    </div>
  );
};
