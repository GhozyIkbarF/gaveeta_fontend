import { createSlice } from "@reduxjs/toolkit";

const pegawaiSlice = createSlice({
    name: "pegawai",
    initialState: {
        action:'create',
        IdAction: 0,
        result: false,
        employes: [],
        dataEditPegawai: '',
        refreshEditPegawai: false,
    },
    reducers:{
        actionPegawai: (state, action) => {
            state.action = action.payload;
        },
        IdActionPegawai: (state, action) => {
            state.IdAction = action.payload;
        },
        changeDataPegawai: (state, action) => {
            if(state.result === false){
                state.result = action.payload;
            }else{
                state.result = false
            }
        },
        setEmployes: (state, action) => {
            state.employes = action.payload;
          },
        setDataEditPegawai: (state, action) => {
            state.dataEditPegawai = action.payload;
            state.refreshEditPegawai = !state.refreshEditPegawai;
        }
    },
});

export const { 
    actionPegawai, 
    IdActionPegawai, 
    changeDataPegawai, 
    setEmployes, 
    setDataEditPegawai
} = pegawaiSlice.actions;

export default pegawaiSlice.reducer;