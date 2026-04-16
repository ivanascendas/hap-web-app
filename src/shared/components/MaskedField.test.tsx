import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MaskedField } from "./MaskedField";

// MUI ThemeProvider is not strictly required for unit tests with basic MUI components,
// but if tests fail on theme, wrap with createTheme/ThemeProvider.

describe("MaskedField", () => {
  it("renders masked IBAN by default", () => {
    render(<MaskedField value="IE29AIBK93115212345678" type="iban" />);
    const text = screen.getByText(/^IE\*/);
    expect(text).toBeInTheDocument();
    // Should not show full value
    expect(
      screen.queryByText("IE29AIBK93115212345678"),
    ).not.toBeInTheDocument();
  });

  it("reveals full IBAN when toggle is clicked", () => {
    render(<MaskedField value="IE29AIBK93115212345678" type="iban" />);
    const toggleBtn = screen.getByRole("button", { name: /show value/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByText("IE29AIBK93115212345678")).toBeInTheDocument();
  });

  it("hides value again on second toggle click", () => {
    render(<MaskedField value="IE29AIBK93115212345678" type="iban" />);
    const toggleBtn = screen.getByRole("button", { name: /show value/i });
    fireEvent.click(toggleBtn); // show
    fireEvent.click(screen.getByRole("button", { name: /hide value/i })); // hide
    expect(
      screen.queryByText("IE29AIBK93115212345678"),
    ).not.toBeInTheDocument();
  });

  it("renders masked BIC by default", () => {
    render(<MaskedField value="AIBKIE2D" type="bic" />);
    expect(screen.getByText("****IE2D")).toBeInTheDocument();
  });

  it("renders masked PPSN by default", () => {
    render(<MaskedField value="1234567T" type="ppsn" />);
    expect(screen.getByText("********")).toBeInTheDocument();
  });

  it("renders masked address by default", () => {
    render(<MaskedField value="10 Main Street, Dublin" type="address" />);
    expect(screen.getByText("10 Main ...")).toBeInTheDocument();
    expect(
      screen.queryByText("10 Main Street, Dublin"),
    ).not.toBeInTheDocument();
  });

  it("renders dash when value is null", () => {
    render(<MaskedField value={null} type="iban" />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("starts visible when defaultVisible is true", () => {
    render(
      <MaskedField
        value="IE29AIBK93115212345678"
        type="iban"
        defaultVisible={true}
      />,
    );
    expect(screen.getByText("IE29AIBK93115212345678")).toBeInTheDocument();
  });

  it("has accessible toggle button", () => {
    render(<MaskedField value="AIBKIE2D" type="bic" />);
    const btn = screen.getByRole("button", { name: /show value/i });
    expect(btn).toBeInTheDocument();
  });
});
