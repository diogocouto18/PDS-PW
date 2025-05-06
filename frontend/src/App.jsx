import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/menu"
import Login from "./pages/login"
import Registo from "./pages/registo"
import Eventos from "./pages/eventos";
import AnunciosAdmin from "./pages/voluntariadoAdmin";
import "./styles/App.css"


function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/voluntariado" element={<AnunciosAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
