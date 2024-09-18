import React from "react";
import "./Loading.scss";

type LoadingProps = {
  isLoading?: boolean;
  percent?: number;
};

export const Loading = ({ isLoading, percent }: LoadingProps): JSX.Element => {
  return (
    <div className="loading-overlay">
      <div
        className={`loading-overlay__progress ${isLoading ? "in-progress" : ""}`}
        style={percent ? { width: `${percent}%` } : {}}
      ></div>
    </div>
  );
};
