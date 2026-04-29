import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Home from './components/home';
import Dashboard from './components/DashboardAdmin';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Dashboard/>}/>
        <Route path="/registro" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
