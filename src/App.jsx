import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Konsultasi from "./pages/Konsultasi";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-yellow-50 text-gray-900">
        {/* Navbar */}
        <header className="fixed top-0 w-full z-20 backdrop-blur-md bg-yellow-200/50 border-b border-yellow-300">
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
            <div className="text-xl font-bold tracking-wide">PsyTech</div>
            <div className="flex space-x-6 text-sm">
              <Link to="/" className="hover:text-yellow-700 transition">Dashboard</Link>
              <Link to="/konsultasi" className="hover:text-yellow-700 transition">Konsultasi</Link>
              <Link to="#" className="hover:text-yellow-700 transition">About</Link>
            </div>
          </div>
        </header>

        <main className="pt-24 max-w-6xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/konsultasi" element={<Konsultasi />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-12 py-4 text-center text-gray-700 text-sm border-t border-yellow-300">
          <p>Design by: <strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
        </footer>
      </div>
    </Router>
  );
}
