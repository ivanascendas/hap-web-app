import { LoginFormComponent } from "./components/LoginForm.component";
import { useCheckTempPasswordMutation } from "../../shared/services/Auth.service";
import { RegistrationComponent } from "./components/Registration.components";
import { MainComponent } from "../main/Main.component";
import "./Auth.component.scss";

export const AuthComponent = (): JSX.Element => {
  const [checkTempPassword, result] = useCheckTempPasswordMutation();
  if (result.isSuccess && !result.data?.code) {
    return <RegistrationComponent />;
  }
  return (
    <MainComponent>
      <LoginFormComponent onSubmit={checkTempPassword} />
    </MainComponent>
  );
};
