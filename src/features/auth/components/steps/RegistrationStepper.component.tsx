import React from "react";
import { RegUserDataFormComponent } from "./RegUserDataForm.component";

type RegistrationStepperProps = {
  step: string;
};

export const RegistrationStepper = ({
  step,
}: RegistrationStepperProps): JSX.Element => {
  switch (step) {
    case "step1":
      return <RegUserDataFormComponent />;
    case "2":
      return <div>Step 2</div>;
    case "3":
      return <div>Step 3</div>;
    default:
      return <div>Step 1</div>;
  }
};
