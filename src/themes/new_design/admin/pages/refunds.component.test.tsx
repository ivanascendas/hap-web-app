import React from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { RefundsComponent } from "./refunds.component";
import { RefundStatus } from "@shared/dtos/refund.dtos";
import authReducer, { setUser } from "@shared/redux/slices/authSlice";
import adminRefundsReducer from "@shared/redux/slices/adminRefundSlice";

const mockNavigate = jest.fn();
const mockGetAdminApplications = jest.fn();
const mockReassignApplication = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@shared/hooks/useUserRole", () => ({
  useUserRole: () => ({
    hasRole: (role: string) => ["DMU_L1", "DMU_L2", "AP"].includes(role),
  }),
}));

jest.mock("@shared/services/Admins.service", () => ({
  useGetAdminsQuery: () => ({
    data: [
      {
        id: "admin-1",
        email: "l1@example.com",
        phoneNumber: "123",
        twoFactorEnabled: false,
        lockoutEndDateUtc: null,
        lockoutEnabled: false,
        userName: "l1-admin",
        incDepts: [],
        roles: ["DMU_L1"],
      },
      {
        id: "client-1",
        email: "client@example.com",
        phoneNumber: "123",
        twoFactorEnabled: false,
        lockoutEndDateUtc: null,
        lockoutEnabled: false,
        userName: "client-user",
        incDepts: [],
        roles: ["Client"],
      },
    ],
    isFetching: false,
  }),
}));

jest.mock("@shared/services/Refunds.service", () => ({
  useLazyGetAdminApplicationsQuery: () => [
    mockGetAdminApplications,
    {
      data: {
        items: [
          {
            applicationId: "app-1",
            referenceCode: "REF-1",
            tenantId: "TEN-1",
            applicantName: "Jane Doe",
            amount: 100,
            currency: "EUR",
            assignedToId: "",
            status: 1,
            createdAt: "2026-04-20T10:00:00Z",
          },
          {
            applicationId: "app-2",
            referenceCode: "REF-2",
            tenantId: "TEN-2",
            applicantName: "John Doe",
            amount: 200,
            currency: "EUR",
            assignedToId: "",
            status: 2,
            createdAt: "2026-04-20T11:00:00Z",
          },
        ],
        count: 14,
      },
      isFetching: false,
      isError: false,
    },
  ],
  useReassignApplicationsMutation: () => [mockReassignApplication],
}));

jest.mock("@shared/utils/showToast", () => ({
  showToast: jest.fn(),
}));

jest.mock("../components/refunds/BulkReassignControls", () => ({
  hasAssignableRole: (admin: { roles: string[] }) =>
    admin.roles.some((role) =>
      ["DMU_L1", "DMU_L2", "AP", "SuperAdmin"].includes(role),
    ),
  BulkReassignControls: ({
    adminOptions,
    selectedCount,
    onSelectedAdminChange,
    onApplyBulkAssign,
  }: {
    adminOptions: Array<{ userName: string }>;
    selectedCount: number;
    onSelectedAdminChange: (admin: { userName: string } | null) => void;
    onApplyBulkAssign: () => void;
  }) => (
    <div>
      <span>Selected: {selectedCount}</span>
      <button
        type="button"
        onClick={() => onSelectedAdminChange(adminOptions[0])}
      >
        Choose l1-admin
      </button>
      <button
        type="button"
        disabled={selectedCount === 0}
        onClick={onApplyBulkAssign}
      >
        Apply bulk
      </button>
    </div>
  ),
}));

const renderComponent = () => {
  const store = configureStore({
    reducer: combineReducers({
      auth: authReducer,
      adminRefunds: adminRefundsReducer,
    }),
  });
  store.dispatch(
    setUser({
      isAdmin: true,
      isSuperAdmin: false,
      customerNo: "admin-user",
    }),
  );

  return render(
    <Provider store={store}>
      <RefundsComponent />
    </Provider>,
  );
};

describe("RefundsComponent bulk reassignment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReassignApplication.mockImplementation(() => ({
      unwrap: () => Promise.resolve({}),
    }));
  });

  it("selects refund applications and reassigns them after confirmation", async () => {
    renderComponent();

    const [, ...rowCheckboxes] = screen.getAllByRole("checkbox");

    fireEvent.click(rowCheckboxes[0]);
    fireEvent.click(rowCheckboxes[1]);

    expect(screen.getByText("Selected: 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Choose l1-admin" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply bulk" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: /REFUNDS.BULK_REASSIGN.CONFIRM/i,
      }),
    );

    await waitFor(() => {
      expect(mockReassignApplication).toHaveBeenCalledTimes(2);
    });

    expect(mockReassignApplication).toHaveBeenCalledWith({
      applicationId: "app-1",
      targetAdminId: "l1-admin",
    });
    expect(mockReassignApplication).toHaveBeenCalledWith({
      applicationId: "app-2",
      targetAdminId: "l1-admin",
    });
  });

  it("selects and clears the current page from the header checkbox", () => {
    renderComponent();

    const [headerCheckbox] = screen.getAllByRole("checkbox");

    expect(headerCheckbox).toBeDefined();
    fireEvent.click(headerCheckbox as HTMLElement);
    expect(screen.getByText("Selected: 2")).toBeInTheDocument();

    fireEvent.click(headerCheckbox as HTMLElement);
    expect(screen.getByText("Selected: 0")).toBeInTheDocument();
  });

  it("moves to the next page and refetches with the correct skip offset", async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText("next page"));

    await waitFor(() => {
      expect(mockGetAdminApplications).toHaveBeenCalledTimes(2);
    });

    expect(mockGetAdminApplications).toHaveBeenLastCalledWith(
      expect.objectContaining({
        $skip: 7,
        $top: 7,
      }),
    );
  });
});
