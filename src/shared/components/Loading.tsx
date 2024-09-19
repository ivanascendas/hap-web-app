import React from "react";
import "./Loading.scss";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const Loading = (): JSX.Element => {
  const { isLoading, percent } = useSelector(
    (state: RootState) => state.loader,
  );

  return (
    <div className="loading-overlay">
      <div
        className={`loading-overlay__progress ${isLoading ? "in-progress" : ""}`}
        style={percent ? { width: `${percent}%` } : {}}
      ></div>
    </div>
  );
};
