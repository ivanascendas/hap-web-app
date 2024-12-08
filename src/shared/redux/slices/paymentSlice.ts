import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { InvoiceDto, InvoiceQueryParams } from "../../dtos/invoice.dtos";
import { paymentsApi } from "../../services/Payment.service";

export type InvoicesState = {
  list: InvoiceDto[];
  incDept: string;
  count: number;
};

const initialState: InvoicesState = {
  list: [],
  incDept: "",
  count: 0,
};

/**
 * Redux slice for managing the state of payments in the application.
 *
 * The `paymentsSlice` contains reducers for setting and clearing the list of payments,
 * as well as handling the fulfilled action from the `getInvoices` API endpoint.
 *
 * The `selectInvoices` selector function can be used to retrieve the list of payments
 * from the Redux store.
 */

const paymentsSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    /**
     * Sets the list of payments in the state.
     *
     * @param state - The current state of the payments slice.
     * @param action - The action that contains the new list of payments.
     * @returns The updated state with the new list of payments.
     */
    setInvoices: (
      state: InvoicesState,
      action: PayloadAction<InvoicesState>,
    ) => {
      return { ...state, payments: action.payload.list };
    },
    /**
     * Clears the list of payments in the state.
     *
     * @param state - The current state of the payments slice.
     * @returns The updated state with an empty list of payments.
     */
    clearInvoices: (state: InvoicesState) => {
      state.list = [];
    },
  },
  extraReducers(builder) {
    /**
     *  Handles the fulfilled action from the `getInvoices` API endpoint.
     */
    builder.addMatcher(
      paymentsApi.endpoints.getInvoices.matchFulfilled,
      (state, { payload, meta }) => {
        const { incDept } = meta.arg
          .originalArgs as unknown as InvoiceQueryParams;

        if (state.incDept !== incDept) {
          state.incDept = incDept;
          state.list = [];
          state.count = payload.count;
        }
        //state.list.push(...payload.items);
        state.list = payload.items;
      },
    );
  },
});

/**
 * Selects the list of payments from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of payments.
 */
export const selectInvoices = (state: RootState): InvoiceDto[] =>
  state.payments.list;
export const selectInvoicesCount = (state: RootState): number =>
  state.payments.count;

export const { setInvoices, clearInvoices } = paymentsSlice.actions;

export default paymentsSlice.reducer;
