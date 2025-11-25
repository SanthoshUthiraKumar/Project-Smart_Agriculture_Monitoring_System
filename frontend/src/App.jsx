import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Analytics from "./pages/Analytics"; // Your existing page
import FieldView from "./pages/FieldView"; // Your existing page
import './App.css';

// Helper component to display the current page title dynamically
const Header = () => {
  const location = useLocation();
  
  // Simple logic to determine title based on path
  let title = "Farm Overview";
  if (location.pathname.includes("field")) title = "Field Details";
  if (location.pathname.includes("analytics")) title = "Analytics Dashboard";

  return (
    <header className="top-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">Real-time monitoring & AI insights</p>
      </div>
      <div className="user-profile">
        <span className="user-name">Admin Farmer</span>
        <div className="user-avatar">AF</div>
      </div>
    </header>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* 1. Sidebar stays fixed on the left */}
        <Sidebar />
        
        {/* 2. Main Content Area */}
        <main className="main-content">
          
          {/* 3. Header stays fixed at the top */}
          <Header />

          {/* 4. Scrollable Area where your Pages change */}
          <div className="content-scrollable">
            <Routes>
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/field/:id" element={<FieldView />} />
              <Route path="/" element={<Analytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;