import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        triggerEditData: false,
        refreshEditCompany: false,
    },
    reducers:{
        setTriggerEditData: (state) => {
            state.triggerEditData = !state.triggerEditData
        },
        setRefreshEditCompany: (state) => {
           state.refreshEditCompany = !state.refreshEditCompany
        }
    },
});

export const {
    setTriggerEditData,
    setRefreshEditCompany
} = companySlice.actions;

export default companySlice.reducer;