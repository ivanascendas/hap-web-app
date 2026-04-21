import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  BulkReassignControls,
  formatAdminRoleLabels,
  getAdminOptionLabel,
  hasAssignableRole,
} from "./BulkReassignControls";
import { AdminDto } from "@shared/dtos/admins.dtos";

const l1Admin: AdminDto = {
  id: "1",
  email: "l1@example.com",
  phoneNumber: "123",
  twoFactorEnabled: false,
  lockoutEndDateUtc: null,
  lockoutEnabled: false,
  userName: "l1-admin",
  incDepts: [],
  roles: ["DMU_L1", "AP"],
};

const clientOnlyUser: AdminDto = {
  ...l1Admin,
  id: "2",
  userName: "client-user",
  roles: ["Client"],
};

describe("BulkReassignControls", () => {
  it("detects assignable admins and formats role labels", () => {
    expect(hasAssignableRole(l1Admin)).toBe(true);
    expect(hasAssignableRole(clientOnlyUser)).toBe(false);
    expect(
      formatAdminRoleLabels(["DMU_L1", "DMU_L2", "AP", "SuperAdmin"]),
    ).toBe("L1, L2, AP, SuperAdmin");
    expect(getAdminOptionLabel(l1Admin)).toBe("l1-admin - L1, AP");
  });

  it("disables Apply until an admin and at least one application are selected", () => {
    const onApply = jest.fn();

    const { rerender } = render(
      <BulkReassignControls
        adminOptions={[l1Admin]}
        selectedAdmin={null}
        selectedCount={1}
        onSelectedAdminChange={jest.fn()}
        onApplyBulkAssign={onApply}
      />,
    );

    expect(
      screen.getByRole("button", { name: /REFUNDS.BULK_REASSIGN.APPLY/i }),
    ).toBeDisabled();

    rerender(
      <BulkReassignControls
        adminOptions={[l1Admin]}
        selectedAdmin={l1Admin}
        selectedCount={1}
        onSelectedAdminChange={jest.fn()}
        onApplyBulkAssign={onApply}
      />,
    );

    const applyButton = screen.getByRole("button", {
      name: /REFUNDS.BULK_REASSIGN.APPLY/i,
    });
    expect(applyButton).toBeEnabled();

    fireEvent.click(applyButton);
    expect(onApply).toHaveBeenCalledTimes(1);
  });
});
