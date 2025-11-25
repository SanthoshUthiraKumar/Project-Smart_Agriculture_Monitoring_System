import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import FieldView from "./pages/FieldView";
import Analytics from "./pages/Analytics";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/field/:id" element={<FieldView />} />
        <Route path="/" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
