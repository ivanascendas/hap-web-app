import { LoginFormComponent } from "./components/LoginForm.component";
import {
  useCheckTempPasswordMutation,
  useForgotPasswordMutation,
  useLoginMutation,
} from "../../shared/services/Auth.service";
import { RegistrationComponent } from "./components/Registration.components";
import { MainComponent } from "../main/Main.component";
import "./Auth.component.scss";
import { Loading } from "../../shared/components/Loading";
import { ForgotPasswordFormComponent } from "./components/ForgotPasswordForm.component";

type AuthProps = {
  type: string;
};

export const AuthComponent = ({ type }: AuthProps): JSX.Element => {
  const [checkTempPassword, result] = useCheckTempPasswordMutation();
  const [forgotPassword, forgotResult] = useForgotPasswordMutation();
  const [login, loginResult] = useLoginMutation();

  if (result.isSuccess && !result.data?.code) {
    return (
      <MainComponent>
        <RegistrationComponent />
      </MainComponent>
    );
  }
  switch (type) {
    case "forgotPassword":
      return (
        <MainComponent>
          <Loading isLoading={result.isLoading || loginResult.isLoading} />
          <ForgotPasswordFormComponent onSubmit={forgotPassword} />
        </MainComponent>
      );
    case "login":
    default:
      return (
        <MainComponent>
          <Loading isLoading={result.isLoading || loginResult.isLoading} />
          <LoginFormComponent onSubmit={checkTempPassword} />
        </MainComponent>
      );
  }
};
