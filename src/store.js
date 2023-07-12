import { configureStore } from "@reduxjs/toolkit";
import pegawaiReducer from "./Features/Pegawai";
import PesananMasukReducer from "./Features/Pesanan/PesananMasuk";
import PesananProsesReducer from "./Features/Pesanan/PesananProses";
import PesananSelesaiReducer from "./Features/Pesanan/PesananSelesai";
import PesananDetailReducer from "./Features/Pesanan/PesananDetail"
import CompanyReducer from "./Features/Company";
import UtilsReducer from "./Features/Utils";

const store = configureStore({
    reducer: {
        pegawai: pegawaiReducer,
        pesananDetail: PesananDetailReducer,
        pesananMasuk: PesananMasukReducer,
        pesananProses: PesananProsesReducer,
        pesananSelesai: PesananSelesaiReducer,
        company: CompanyReducer,
        utils: UtilsReducer,
    }
})
 export default store;