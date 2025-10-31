import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RefundStatus } from "../../dtos/refund.dtos";

/**
 * Admin filters state for refund applications
 */
export interface AdminFiltersState {
  status?: RefundStatus[];
  customerNo?: string;
  department?: string;
  incDept?: string;
  search?: string;
}

/**
 * Pagination state for admin refund list
 */
export interface AdminPaginationState {
  pageNumber: number;
  pageSize: number;
}

/**
 * Modal types for admin actions
 */
export type ModalType = "approve" | "reject" | "requestInfo" | "cancel";

/**
 * Modal data state
 */
export interface ModalDataState {
  level?: number;
  applicationId?: string;
}

/**
 * Admin refund slice state
 */
export interface AdminRefundState {
  adminFilters: AdminFiltersState;
  adminPagination: AdminPaginationState;
  selectedApplicationId: string | null;
  activeModal: ModalType | null;
  modalData: ModalDataState;
}

const initialState: AdminRefundState = {
  adminFilters: {
    status: [
      RefundStatus.Submitted,
      RefundStatus.PendingL1,
      RefundStatus.PendingL2,
      RefundStatus.PendingAP,
      RefundStatus.ReturnedForInfo,
    ],
  },
  adminPagination: {
    pageNumber: 0,
    pageSize: 7,
  },
  selectedApplicationId: null,
  activeModal: null,
  modalData: {},
};

/**
 * Redux slice for managing admin refund applications UI state
 *
 * This slice contains state for:
 * - Filters (status, customerNo, department, etc.)
 * - Pagination (pageNumber, pageSize)
 * - Selected application
 * - Active modal and modal data
 */
const adminRefundSlice = createSlice({
  name: "adminRefunds",
  initialState,
  reducers: {
    /**
     * Sets admin filters for refund applications
     */
    setAdminFilters: (
      state: AdminRefundState,
      action: PayloadAction<Partial<AdminFiltersState>>,
    ) => {
      state.adminFilters = { ...state.adminFilters, ...action.payload };
    },

    /**
     * Sets admin pagination settings
     */
    setAdminPagination: (
      state: AdminRefundState,
      action: PayloadAction<Partial<AdminPaginationState>>,
    ) => {
      state.adminPagination = { ...state.adminPagination, ...action.payload };
    },

    /**
     * Sets the selected application ID
     */
    selectApplication: (
      state: AdminRefundState,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedApplicationId = action.payload;
    },

    /**
     * Opens a modal with specific data
     */
    openModal: (
      state: AdminRefundState,
      action: PayloadAction<{
        modal: ModalType;
        level?: number;
        applicationId: string;
      }>,
    ) => {
      state.activeModal = action.payload.modal;
      state.modalData = {
        level: action.payload.level,
        applicationId: action.payload.applicationId,
      };
    },

    /**
     * Closes the active modal
     */
    closeModal: (state: AdminRefundState) => {
      state.activeModal = null;
      state.modalData = {};
    },

    /**
     * Resets admin filters to initial state
     */
    resetAdminFilters: (state: AdminRefundState) => {
      state.adminFilters = initialState.adminFilters;
    },
  },
});

// Selectors
/**
 * Selects admin filters from state
 */
export const selectAdminFilters = (state: RootState): AdminFiltersState =>
  state.adminRefunds.adminFilters;

/**
 * Selects admin pagination from state
 */
export const selectAdminPagination = (state: RootState): AdminPaginationState =>
  state.adminRefunds.adminPagination;

/**
 * Selects the selected application ID
 */
export const selectSelectedApplicationId = (state: RootState): string | null =>
  state.adminRefunds.selectedApplicationId;

/**
 * Selects the active modal type
 */
export const selectActiveModal = (state: RootState): ModalType | null =>
  state.adminRefunds.activeModal;

/**
 * Selects modal data
 */
export const selectModalData = (state: RootState): ModalDataState =>
  state.adminRefunds.modalData;

// Export actions
export const {
  setAdminFilters,
  setAdminPagination,
  selectApplication,
  openModal,
  closeModal,
  resetAdminFilters,
} = adminRefundSlice.actions;

export default adminRefundSlice.reducer;
