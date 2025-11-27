import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Analytics from "./pages/Analytics";
import FieldView from "./pages/FieldView";
import Login from "./pages/Login";

// Header Component with Tailwind
const Header = () => {
  const location = useLocation();
  
  let title = "Farm Overview";
  if (location.pathname.includes("field")) title = "Field Details";
  if (location.pathname.includes("analytics")) title = "Analytics Dashboard";

  return (
    <header className="bg-hr-card border-b border-hr-border px-8 py-5 flex justify-between items-center min-h-[70px] relative z-10">
      <div>
        <h1 className="text-2xl font-bold text-hr-text font-inter tracking-tight mb-1">
          {title}
        </h1>
        <p className="text-hr-text-secondary text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-hr-green rounded-full animate-pulse-slow"></span>
          Real-time monitoring & AI insights
        </p>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-hr-dark rounded-lg transition-all duration-200 hover:bg-hr-hover hover:border-hr-green border border-hr-border cursor-pointer">
        <span className="font-semibold text-hr-text text-sm">Admin Farmer</span>
        <div className="w-9 h-9 bg-hr-green text-hr-darker rounded-full flex items-center justify-center font-bold text-sm">
          AF
        </div>
      </div>
    </header>
  );
};

// Layout wrapper that conditionally shows sidebar and header
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-hr-darker">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-hr-darker overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-hr-darker">
          {children}
        </div>
      </main>
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