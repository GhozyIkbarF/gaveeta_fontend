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
import Company from "../Pages/Company";
import EditCompany from "../Components/Company/EditCompany";
import OutRoute from "../Pages/OutRoute";
import { userRole } from "../Features/Utils";

export default function AppRoute() {

  return (
    <BrowserRouter>
      <Box>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/dashboard" element={<SidebarWithHeader children={<Beranda />} />} />
          <Route path="/pesananmasuk" element={<SidebarWithHeader children={<TabelPesananMasuk />} />} />
          <Route path="/pesananproses" element={<SidebarWithHeader children={<TabelPesananProses />} />} />
          <Route path="/pesananselesai" element={<SidebarWithHeader children={<TabelPesananSelesai />} />} />
          <Route path="/pesananmasuk_detail/:id" element={<SidebarWithHeader children={<PesananDetail />} />} />
          <Route path="/pesananproses_detail/:id" element={<SidebarWithHeader children={<PesananDetail />} />} />
          <Route path="/pesananselesai_detail/:id" element={<SidebarWithHeader children={<PesananDetail />} />} />
          {userRole === 'superAdmin' ? 
          <>
          <Route path="/laporan" element={<SidebarWithHeader children={<Data />} />} />
          <Route path="/company_setting" element={<SidebarWithHeader children={<EditCompany />} />} />
          </> : null}
          <Route path="/pegawai" element={<SidebarWithHeader children={<Pegawai />} />} />
          <Route path="/company" element={<SidebarWithHeader children={<Company />} />} />
          <Route path="*" element={<OutRoute/>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}