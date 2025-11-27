import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Analytics from "./pages/Analytics";
import FieldView from "./pages/FieldView";
import Login from "./pages/Login";

// Header Component - Apple Structure with HackerRank Colors
const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 tracking-tight">FarmTech</span>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="/analytics" 
              className={`text-xs font-medium transition-colors ${
                location.pathname.includes('analytics') 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </a>
            <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Fields
            </a>
            <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Analytics
            </a>
            <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Reports
            </a>
            <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Settings
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-full cursor-pointer transition-all">
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px] font-semibold">
                AU
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Content wrapper with Apple-style spacing
const ContentWrapper = ({ children }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
      {children}
    </div>
  );
};

// Layout wrapper - Apple structure without traditional sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  if (isLoginPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="min-h-[calc(100vh-56px)]">
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </main>
      
      {/* Optional: Apple-style footer */}
      <footer className="border-t border-gray-200/50 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <p>© 2024 FarmTech. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/field/:id" element={<FieldView />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;