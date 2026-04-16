import React from "react";
import { render, screen } from "@testing-library/react";
import { SelectChangeEvent } from "@mui/material";
import { BshComparisonTableComponent } from "./BshComparisonTableComponent";
import type {
  RefundApplicationDto,
  VerifyBshResponse,
} from "@shared/dtos/refund.dtos";

const application = {
  applicantName: "Jane Doe",
  address: "10 Main Street, Dublin",
  bic: "AIBKIE2D",
  createdAt: new Date("2026-04-15T12:00:00Z"),
  iban: "IE29AIBK93115212345678",
  jointTenancy: false,
} as RefundApplicationDto;

const bshResult: VerifyBshResponse = {
  documentStatus: "VALID",
  extracted: {
    iban: "IE29AIBK93115212345678",
    bic: "AIBKIE2D",
    accountName: "Jane Doe",
    statementDate: "2026-04-15T12:00:00Z",
    customerAddress: "10 Main Street, Dublin",
    ibanConfidence: 0.95,
    isIbanLowConfidence: false,
    bicConfidence: 0.88,
    isBicLowConfidence: false,
    accountNameConfidence: 0.67,
    isAccountNameLowConfidence: true,
    statementDateConfidence: 0.91,
    isStatementDateLowConfidence: false,
    customerAddressConfidence: 0.78,
    isCustomerAddressLowConfidence: false,
  },
};

describe("BshComparisonTableComponent", () => {
  const renderComponent = (result: VerifyBshResponse | null = bshResult) =>
    render(
      <BshComparisonTableComponent
        selectedStatus=""
        handleStatusChange={jest.fn<void, [SelectChangeEvent<string>]>()}
        application={application}
        bshResult={result}
      />,
    );

  it("renders BIC and Account Name rows with confidence badges", () => {
    renderComponent();

    expect(screen.getByText("BIC")).toBeInTheDocument();
    expect(screen.getByText("Account Name")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  it("does not render BIC or Account Name confidence badges when confidence is null", () => {
    renderComponent({
      ...bshResult,
      extracted: {
        ...bshResult.extracted,
        bicConfidence: null,
        accountNameConfidence: null,
      },
    });

    expect(screen.getByText("BIC")).toBeInTheDocument();
    expect(screen.getByText("Account Name")).toBeInTheDocument();
    expect(screen.queryByText("88%")).not.toBeInTheDocument();
    expect(screen.queryByText("67%")).not.toBeInTheDocument();
  });
});
