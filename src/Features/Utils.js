import { createSlice } from "@reduxjs/toolkit";

export const username = localStorage.getItem('name');
export const userRole = localStorage.getItem('role');
const UtilsSlice = createSlice({
    name: "state",
    initialState: {
        displaySidebar: 'block'
    },
    reducers:{
        setDisplaySidebar: (state) => {
            state.displaySidebar = state.displaySidebar === 'block' ? 'none' : 'block';
        },
    },
});

export const {
    setDisplaySidebar,
} = UtilsSlice.actions;

export default UtilsSlice.reducer;