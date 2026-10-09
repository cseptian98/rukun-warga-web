import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portal from './pages/Portal';
import WaterSystem from './pages/WaterSystem';
import Announcements from './pages/Announcements';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/water-system" element={<WaterSystem />} />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </BrowserRouter>
  );
}
