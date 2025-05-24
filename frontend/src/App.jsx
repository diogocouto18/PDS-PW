import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./styles/App.css"
import Login from "./pages/LoginRegisto/login";
import Registo from "./pages/LoginRegisto/registo";
import Menu from "./pages/Menu/menu";
import MenuAdministrador from "./pages/Menu/menuAdministradores";
import EventosAdministrador from "./pages/Eventos/eventosAdministrador";
import AnunciosAdministrador from "./pages/Voluntariado/voluntariadoAdministrador";
import SuporteAdministrador from "./pages/Suporte/suporteAdministrador";
import PerfilAdministrador from "./pages/perfilAdministrador";
import Suporte from "./pages/Suporte/suporte";
import Suporte3 from "./pages/Suporte/suporte3";
import PerfilUtilizador from "./pages/Perfil/perfilUtilizador";
import Voluntariado from "./pages/Voluntariado/voluntariadoUtilizador";
import NotificacoesPage from "./pages/Notificacao/notificacoes"
import Eventos from "./pages/Eventos/eventos";

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
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/voluntariado" element={<Voluntariado />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/perfil" element={<PerfilUtilizador />} />
          <Route path="/notificacao" element={<NotificacoesPage />} />
          <Route path="/suporte3" element={<Suporte3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

       

// <Route path="/eventos" element={<Eventos />} />
// <Route path="/voluntariado" element={<Voluntariado />} />

          