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

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
