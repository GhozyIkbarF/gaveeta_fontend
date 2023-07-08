import { createSlice } from "@reduxjs/toolkit";

const pesananDetailSlice = createSlice({
    name: "pesananMasuk",
    initialState: {
        dataDetailOrder:[],
        actionDetailOrder:'',
        typeImage: '',
        allDesignItems:[],
        allModelItems:[],
        IdRemoveImage: 0,
        refreshDetailPesanan: false,
        refreshModalRemoveImage: false,
        refreshModalAction: false,
    },
    reducers:{
        setDataDetailOrder:(state, action) => {
            state.dataDetailOrder= action.payload;
        },
        setAllDesignItems:(state, action) => {
            state.allDesignItems = action.payload;
        },
        setAllModelItems:(state, action) => {
            state.allModelItems = action.payload;
        },
        setActionDetailOrder: (state, action) => {
            state.actionDetailOrder = action.payload;
        },
        setTypeDetailItem:(state, action) => {
            state.typeImage = action.payload;
        },
        setIdRemoveImage: (state, action) => {
            state.IdRemoveImage = action.payload;
        },
        setRefreshDetailPesanan: (state) => {
            state.refreshDetailPesanan = !state.refreshDetailPesanan
        },
        setRefreshModalRemoveImage: (state) => {
           state.refreshModalRemoveImage = !state.refreshModalRemoveImage
        }
    },
});

export const { 
    setDataDetailOrder,
    setAllDesignItems,
    setAllModelItems, 
    setActionDetailOrder, 
    setTypeDetailItem, 
    setIdRemoveImage, 
    setRefreshDetailPesanan, 
    setRefreshModalRemoveImage,
} = pesananDetailSlice.actions;

export default pesananDetailSlice.reducer;