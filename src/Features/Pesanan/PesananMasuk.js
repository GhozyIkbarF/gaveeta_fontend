import { createSlice } from "@reduxjs/toolkit";

const pesananMasukSlice = createSlice({
    name: "pesananMasuk",
    initialState: {
        actionOrderMasuk:'create',
        IdActionOrder: 0,
        resultOrderMasuk: false,
        dataOrder:[],
        refreshOrderMasuk: false,

    },
    reducers:{
        actionPesananMasuk: (state, action) => {
            state.actionOrderMasuk = action.payload;
        },
        setIdActionOrder: (state, action) => {
            state.IdActionOrder = action.payload;
        },
        setRefresOrderMasuk: (state) => {
           state.refreshOrderMasuk = !state.refreshOrderMasuk
        },
        setDataOrder: (state, action) => {
            state.dataOrder = action.payload;
        },
    },
});

export const {
    actionPesananMasuk, 
    setIdActionOrder, 
    setRefresOrderMasuk, 
    setDataOrder, 
} = pesananMasukSlice.actions;

export default pesananMasukSlice.reducer;