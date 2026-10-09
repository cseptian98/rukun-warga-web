import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portal from './pages/Portal';
import WaterSystem from './pages/WaterSystem';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/water-system" element={<WaterSystem />} />
      </Routes>
    </BrowserRouter>
  );
}
