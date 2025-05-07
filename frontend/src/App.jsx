import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Eventos from "./pages/eventos";
import Login from "./pages/login";
import Menu from "./pages/menu";
import Registo from "./pages/registo";
import Suporte3 from "./pages/suporte3";
import AnunciosAdmin from "./pages/voluntariadoAdmin";
import SuporteAdmin1 from "./pages/suporte-admin";
import "./styles/App.css"
import MenuAdministrador from "./pages/menuAdministradores";


function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menuAdministrador" element={<MenuAdministrador />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/voluntariado" element={<AnunciosAdmin />} />
          <Route path="/SuporteAdmin" element={<SuporteAdmin1 />} />
          <Route path="/suporte3" element={<Suporte3 />} />
          <Route path="/perfil" element={<PerfilUtilizador />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
