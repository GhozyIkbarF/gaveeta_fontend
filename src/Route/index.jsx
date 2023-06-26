import React from "react";
import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import SidebarWithHeader from "../Pages/Admin";
import Beranda from "../Pages/Beranda";
import Pegawai from "../Pages/Pegawai";
import TabelPesananMasuk from "../Components/Pesanan/Table/TabelBody/TabelPesananMasuk";
import TabelPesananProses from "../Components/Pesanan/Table/TabelBody/TabelPesananProses";
import TabelPesananSelesai from "../Components/Pesanan/Table/TabelBody/TabelPesananSelesai";
import PesananDetail from "../Components/Pesanan/PesananDetail/PesananDetail";
import Data from "../Pages/Data";
import Setting from "../Pages/Setting";
import OutRoute from "../Pages/OutRoute";


export default function AppRoute() {

  return (
    <BrowserRouter>
      <Box>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/beranda" element={<SidebarWithHeader children={<Beranda />} />} />
          <Route path="/pesanan_masuk" element={<SidebarWithHeader children={<TabelPesananMasuk />} />} />
          <Route path="/pesanan_proses" element={<SidebarWithHeader children={<TabelPesananProses />} />} />
          <Route path="/pesananmasuk_detail/:id" element={<SidebarWithHeader children={<PesananDetail />} />} />
          <Route path="/pesananproses_detail/:id" element={<SidebarWithHeader children={<PesananDetail />} />} />
          <Route path="/pesanan_selesai" element={<SidebarWithHeader children={<TabelPesananSelesai />} />} />
          <Route path="/pegawai" element={<SidebarWithHeader children={<Pegawai />} />} />
          <Route path="/data" element={<SidebarWithHeader children={<Data />} />} />
          <Route path="/setting" element={<SidebarWithHeader children={<Setting />} />} />
          <Route path="*" element={<OutRoute/>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}