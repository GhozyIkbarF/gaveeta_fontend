import { createSlice } from "@reduxjs/toolkit";

const pesananSelesaiSlice = createSlice({
    name: "pesananSelesai",
    initialState: {
        actionOrderSelesai:'',
    },
    reducers:{
        setActionOrderSelesai: (state, action) => {
            state.actionOrderSelesai = action.payload;
        },
    },
});

export const {
    setActionactionOrderSelesai, 
} = pesananSelesaiSlice.actions;

export default pesananSelesaiSlice.reducer;