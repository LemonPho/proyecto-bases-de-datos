import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Home from './components/home';
import Login from './components/Login';
import Register from './components/Register';
import RefugiosAdmin from './components/admin/refugios/RefugiosAdmin';
import AdminLayout from './components/admin/AdminLayout';
import AdminHome from './components/admin/AdminHome';
import RefugioDetalles from './components/admin/refugios/RefugioDetalles';
import InventarioAdmin from './components/admin/inventario/InventarioAdmin';
import InventarioDetalles from './components/admin/inventario/InventarioDetalles';
import UsuariosAdmin from './components/admin/usuarios/UsuariosAdmin';
import UsuarioDetalles from './components/admin/usuarios/UsuarioDetalles';
import AdopcionesAdmin from './components/admin/adopciones/AdopcionesAdmin';
import SolicitudDetalles from './components/admin/adopciones/SolicitudDetalles';
import RescatesAdmin from './components/admin/rescates/RescatesAdmin';
import RescateDetalles from './components/admin/rescates/RescateDetalles';
import FinanzasAdmin from './components/admin/finanzas/FinanzasAdmin';
import DonacionDetalles from './components/admin/finanzas/DonacionDetalles';
import GastoDetalles from './components/admin/finanzas/GastoDetalles';
import RecursosAdmin from './components/admin/recursos/RecursosAdmin';
import EmpleadoDetalles from './components/admin/recursos/EmpleadoDetalles';

import AnimalesAdmin from './components/admin/animales/AnimalesAdmin';
import AnimalDetalles from './components/admin/animales/AnimalDetalles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="refugio" element={<RefugiosAdmin />} />
          <Route path="refugio/:id" element={<RefugioDetalles />} />
          <Route path="inventario" element={<InventarioAdmin/>} />
          <Route path="inventario/:id" element={<InventarioDetalles/>} />
          <Route path="usuario" element={<UsuariosAdmin/>} />
          <Route path="usuario/:id" element={<UsuarioDetalles/>} />
          <Route path="adopciones" element={<AdopcionesAdmin/>} />
          <Route path="adopciones/:id" element={<SolicitudDetalles/>} />
          <Route path="rescates" element={<RescatesAdmin/>} />
          <Route path="rescates/:id" element={<RescateDetalles/>} />
          <Route path="finanzas" element={<FinanzasAdmin/>} />
          <Route path="finanzas/donacion/:id" element={<DonacionDetalles/>} />
          <Route path="finanzas/gasto/:id" element={<GastoDetalles/>} />
          <Route path="recursos" element={<RecursosAdmin/>} />
          <Route path="recursos/:id" element={<EmpleadoDetalles/>} />          
          <Route path="animales" element={<AnimalesAdmin />} />
          <Route path="animales/:id" element={<AnimalDetalles />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
