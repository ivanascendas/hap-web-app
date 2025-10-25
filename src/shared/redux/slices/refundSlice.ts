import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  RefundApplicationDto,
  RefundApplicationQueryParams,
  RefundStatus,
} from "../../dtos/refund.dtos";
import { refundsApi } from "../../services/Refunds.service";

/**
 * State interface for refund applications
 */
export interface RefundState {
  list: RefundApplicationDto[];
  count: number;
  currentPage: number;
  totalPages: number;
  filters: RefundApplicationQueryParams;
  selectedApplication: RefundApplicationDto | null;
}

const initialState: RefundState = {
  list: [],
  count: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    $skip: 0,
    $top: 20,
  },
  selectedApplication: null,
};

/**
 * Redux slice for managing refund applications state
 *
 * The `refundSlice` contains reducers for managing the list of refund applications,
 * filters, pagination, and the currently selected application.
 */
const refundSlice = createSlice({
  name: "refunds",
  initialState,
  reducers: {
    /**
     * Sets the list of refund applications
     */
    setApplications: (
      state: RefundState,
      action: PayloadAction<RefundApplicationDto[]>,
    ) => {
      state.list = action.payload;
    },

    /**
     * Clears the list of refund applications
     */
    clearApplications: (state: RefundState) => {
      state.list = [];
      state.count = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },

    /**
     * Sets filters for refund applications
     */
    setFilters: (
      state: RefundState,
      action: PayloadAction<RefundApplicationQueryParams>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    /**
     * Clears all filters
     */
    clearFilters: (state: RefundState) => {
      state.filters = {
        $skip: 0,
        $top: 20,
      };
    },

    /**
     * Sets the currently selected application
     */
    setSelectedApplication: (
      state: RefundState,
      action: PayloadAction<RefundApplicationDto | null>,
    ) => {
      state.selectedApplication = action.payload;
    },

    /**
     * Sets the current page
     */
    setCurrentPage: (state: RefundState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.filters.$skip = (action.payload - 1) * (state.filters.$top || 20);
    },

    /**
     * Sets the page size
     */
    setPageSize: (state: RefundState, action: PayloadAction<number>) => {
      state.filters.$top = action.payload;
      state.filters.$skip = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    /**
     * Handles the fulfilled action from the `getApplications` endpoint
     */
    builder.addMatcher(
      refundsApi.endpoints.getApplications.matchFulfilled,
      (state, { payload }) => {
        state.list = payload.items;
        state.count = payload.count;
        state.currentPage = payload.currentPage;
        state.totalPages = payload.totalPages;
      },
    );

    /**
     * Handles the fulfilled action from the `getApplicationById` endpoint
     */
    builder.addMatcher(
      refundsApi.endpoints.getApplicationById.matchFulfilled,
      (state, { payload }) => {
        state.selectedApplication = payload;
      },
    );

    /**
     * Handles the fulfilled action from the `createApplication` endpoint
     */
    builder.addMatcher(
      refundsApi.endpoints.createApplication.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload);
        state.count += 1;
      },
    );

    /**
     * Handles the fulfilled action from the `updateApplication` endpoint
     */
    builder.addMatcher(
      refundsApi.endpoints.updateApplication.matchFulfilled,
      (state, { payload }) => {
        const index = state.list.findIndex(
          (app) => app.applicationId === payload.applicationId,
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
        if (
          state.selectedApplication?.applicationId === payload.applicationId
        ) {
          state.selectedApplication = payload;
        }
      },
    );

    /**
     * Handles the fulfilled action from the `deleteApplication` endpoint
     */
    builder.addMatcher(
      refundsApi.endpoints.deleteApplication.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.list = state.list.filter((app) => app.applicationId !== id);
        state.count -= 1;
        if (state.selectedApplication?.applicationId === id) {
          state.selectedApplication = null;
        }
      },
    );
  },
});

// Selectors
/**
 * Selects the list of refund applications
 */
export const selectRefundApplications = (
  state: RootState,
): RefundApplicationDto[] => state.refunds.list;

/**
 * Selects the total count of refund applications
 */
export const selectRefundCount = (state: RootState): number =>
  state.refunds.count;

/**
 * Selects the current page
 */
export const selectRefundCurrentPage = (state: RootState): number =>
  state.refunds.currentPage;

/**
 * Selects the total pages
 */
export const selectRefundTotalPages = (state: RootState): number =>
  state.refunds.totalPages;

/**
 * Selects the current filters
 */
export const selectRefundFilters = (
  state: RootState,
): RefundApplicationQueryParams => state.refunds.filters;

/**
 * Selects the currently selected application
 */
export const selectSelectedApplication = (
  state: RootState,
): RefundApplicationDto | null => state.refunds.selectedApplication;

/**
 * Selects applications by status
 */
export const selectApplicationsByStatus =
  (status: RefundStatus) =>
  (state: RootState): RefundApplicationDto[] =>
    state.refunds.list.filter((app) => app.status === status);

// Export actions
export const {
  setApplications,
  clearApplications,
  setFilters,
  clearFilters,
  setSelectedApplication,
  setCurrentPage,
  setPageSize,
} = refundSlice.actions;

export default refundSlice.reducer;
