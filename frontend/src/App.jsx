import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./styles/App.css"
import Login from "./pages/login";
import Registo from "./pages/registo";
import Menu from "./pages/menu";
import MenuAdministrador from "./pages/menuAdministradores";
import EventosAdministrador from "./pages/eventosAdministrador";
import AnunciosAdministrador from "./pages/voluntariadoAdministrador";
import SuporteAdministrador from "./pages/suporteAdministrador";
import PerfilAdministrador from "./pages/perfilAdministrador";
import Suporte from "./pages/suporte";
import PerfilUtilizador from "./pages/perfilUtilizador";
import Voluntariado from "./pages/voluntariadoUtilizador";

function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/menuAdministrador" element={<MenuAdministrador />} />
          <Route path="/eventosAdministrador" element={<EventosAdministrador />} />
          <Route path="/voluntariadoAdministrador" element={<AnunciosAdministrador />} />
          <Route path="/suporteAdministrador" element={<SuporteAdministrador />} />
          <Route path="/perfilAdministrador" element={<PerfilAdministrador />} />
          <Route path="/menu" element={<Menu />} />

          <Route path="/voluntariado" element={<Voluntariado />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/perfil" element={<PerfilUtilizador />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
//<Route path="/suporte3" element={<Suporte3 />} />
       

// <Route path="/eventos" element={<Eventos />} />
// <Route path="/voluntariado" element={<Voluntariado />} />

          