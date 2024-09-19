import React from "react";
import "./Main.component.scss";
import { Loading } from "../../shared/components/Loading";

export const MainComponent = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  return (
    <div className="page">
      <Loading />
      {children}
    </div>
  );
};
