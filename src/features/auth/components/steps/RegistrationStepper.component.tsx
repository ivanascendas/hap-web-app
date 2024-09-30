import React from "react";
import { RegUserDataFormComponent } from "./RegUserDataForm.component";
import { RegConfirmFormComponent } from "./RegConfirmForm.component";

type RegistrationStepperProps = {
  step: string;
};

export const RegistrationStepper = ({
  step,
}: RegistrationStepperProps): JSX.Element => {
  switch (step) {
    case "step2":
      return <RegConfirmFormComponent />;
    case "step3":
      return <div>Step 3</div>;
    case "step1":
    default:
      return <RegUserDataFormComponent />;
  }
};
