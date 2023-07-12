import { createSlice } from "@reduxjs/toolkit";

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