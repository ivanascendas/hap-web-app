import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { statementsApi } from "../../services/Statements.service";
import { StatementDto, StatementQueryParams, StatementResponse } from "../../dtos/statement.dtos";

export type StatementsState = {
    list: StatementDto[];
    incDept: string;
    count: number;
}

const initialState: StatementsState = {
    list: [],
    incDept: "",
    count: 0
};

/**
 * Redux slice for managing the state of statements in the application.
 * 
 * The `statementsSlice` contains reducers for setting and clearing the list of statements,
 * as well as handling the fulfilled action from the `getStatements` API endpoint.
 * 
 * The `selectStatements` selector function can be used to retrieve the list of statements
 * from the Redux store.
 */

const statementsSlice = createSlice({
    name: "statement",
    initialState,
    reducers: {
        /**
         * Sets the list of statements in the state.
         *
         * @param state - The current state of the statements slice.
         * @param action - The action that contains the new list of statements.
         * @returns The updated state with the new list of statements.
         */
        setStatements: (state: StatementsState, action: PayloadAction<StatementsState>) => {
            return { ...state, statements: action.payload.list };
        },
        /**
         * Clears the list of statements in the state.
         *
         * @param state - The current state of the statements slice.
         * @returns The updated state with an empty list of statements.
         */
        clearStatements: (state: StatementsState) => {
            state.list = [];
        },
    },
    extraReducers(builder) {
        /**
         *  Handles the fulfilled action from the `getStatements` API endpoint.
         */
        builder.addMatcher(
            statementsApi.endpoints.getStatements.matchFulfilled,
            (state, { payload, meta }) => {
                const { IncDept } = meta.arg.originalArgs as unknown as StatementQueryParams;

                if (state.incDept !== IncDept) {
                    state.incDept = IncDept;
                    state.list = [];
                    state.count = payload.count;
                }
                state.list.push(...payload.items);
            }
        );
    },
});


/**
 * Selects the list of statements from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of statements.
 */
export const selectStatements = (state: RootState): StatementDto[] => state.statements.list;
export const selectStatementsCount = (state: RootState): number => state.statements.count;

export const { setStatements, clearStatements } = statementsSlice.actions;

export default statementsSlice.reducer;