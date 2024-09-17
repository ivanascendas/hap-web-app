import "./Main.component.scss";

export const MainComponent = ({ children }: any): JSX.Element => {
  return <div className="page">{children}</div>;
};
