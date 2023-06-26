import { createSlice } from "@reduxjs/toolkit";

const pesananProsesSlice = createSlice({
    name: "pesananProses",
    initialState: {
        actionOrderProses:'',
        dataOrderProses:[],
        IdActionOrderProses: 0,
        dataDetailOrderProses: [],
        designsOrderProses: [],
        refreshOrderProses: false,
        refreshActionOrderProses: false,
    },
    reducers:{
        actionPesananProses: (state, action) => {
            state.actionOrderProses = action.payload;
        },
        setDataOrderProses: (state, action) => {
            state.dataOrderProses = action.payload;
        },
        setIdActionPesananProses: (state, action) => {
            state.IdActionOrderProses = action.payload;
        },
        setDataDetailOrderProses: (state, action) => {
            state.dataDetailOrderProses = action.payload;
        },
        setDesignsOrderProses:(state, action) => {
            state.designsOrderProses = action.payload
        },
        setRefreshOrderProses: (state, action) => {
            if(state.refreshOrderProses === false){
                state.refreshOrderProses = action.payload;
            }else{
                state.refreshOrderProses = false
            }
        },
        setRefreshActionOrderProses: (state, action) => {
            if(state.refreshActionOrderProses === false){
                state.refreshActionOrderProses = action.payload;
            }else{
                state.refreshActionOrderProses = false
            }
        },
       
    },
})

export const { 
    actionPesananProses, 
    setDataOrderProses, 
    setIdActionPesananProses, 
    setDataDetailOrderProses,
    setDesignsOrderProses,
    setRefreshOrderProses, 
    setRefreshActionOrderProses, 
} = pesananProsesSlice.actions;

export default pesananProsesSlice.reducer;