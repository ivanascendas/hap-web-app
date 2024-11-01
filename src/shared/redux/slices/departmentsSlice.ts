import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DepartmentDto } from "../../dtos/department.dto";

import { RootState } from "../store";
import { departmentsApi } from "../../services/Department.service";

export type DepartmentsState = {
    list: DepartmentDto[];
};

const initialState: DepartmentsState = {
    list: []
};

/**
 * Redux slice for managing the state of departments in the application.
 * 
 * The `departmentsSlice` contains reducers for setting and clearing the list of departments,
 * as well as handling the fulfilled action from the `getDepartments` API endpoint.
 * 
 * The `selectDepartments` selector function can be used to retrieve the list of departments
 * from the Redux store.
 */

const departmentsSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        /**
         * Sets the list of departments in the state.
         *
         * @param state - The current state of the departments slice.
         * @param action - The action that contains the new list of departments.
         * @returns The updated state with the new list of departments.
         */
        setDepartments: (state: DepartmentsState, action: PayloadAction<DepartmentsState>) => {
            return { ...state, departments: action.payload.list };
        },
        /**
         * Clears the list of departments in the state.
         *
         * @param state - The current state of the departments slice.
         * @returns The updated state with an empty list of departments.
         */
        clearDepartments: (state: DepartmentsState) => {
            state.list = [];
        },
    },
    extraReducers(builder) {
        /**
         *  Handles the fulfilled action from the `getDepartments` API endpoint.
         */
        builder.addMatcher(
            departmentsApi.endpoints.getDepartments.matchFulfilled,
            (state, action) => {
                state.list = action.payload;
            }
        );
    },
});


/**
 * Selects the list of departments from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of departments.
 */
export const selectDepartments = (state: RootState): DepartmentDto[] => state.department.list;

export const { setDepartments, clearDepartments } = departmentsSlice.actions;

export default departmentsSlice.reducer;