import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar/sidebarFixed.css';
import { FaEnvelope, FaCalendarAlt, FaClipboardList, FaHeadphones, FaUserShield, FaUser , FaBars } from 'react-icons/fa';

const SidebarFixed = () => {
  const [notificacoesPorAbrir, setNotificacoesPorAbrir] = useState(0); 
  const role = localStorage.getItem('role');
  
  useEffect(() => {
  const fetchNotificacoes = () => {
  
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');

  if (!token || !id || !role) return;

  
    const url = role === "Administrador"
      ? `http://localhost:3000/notificacoes/administrador/${id}/por_abrir`
      : `http://localhost:3000/notificacoes/utilizador/${id}/por_abrir`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
    })
      .then(res => res.json())
      .then(data => setNotificacoesPorAbrir(data.totalPorAbrir))
      .catch(err => console.error(err));
  };

  fetchNotificacoes();
  const interval = setInterval(fetchNotificacoes, 3000); 
  return () => clearInterval(interval);
}, []);


  return (
    <aside className="sidebar">
    <div className="sidebar-top">
      <div className="icon-notificacao" style={{ position: "relative", display: "inline-block" }}>
        <Link to={role === "Administrador" ? "/notificacaoAdministrador" : "/notificacao"}>
          <FaEnvelope className="sidebar-icon" />
        </Link>
        {notificacoesPorAbrir > 0 && (
          <span className="badge-notificacao">{notificacoesPorAbrir}</span>
        )}
      </div>
    </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/menuAdministrador' : '/menu'} className='link_menu'>
              <span className="icon"><FaBars /></span>
              Menu
            </Link>
          </div>
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/eventosAdministrador' : '/eventos'} className='link_menu'>
              <span className="icon"><FaCalendarAlt /></span>
              Eventos
            </Link>
          </div>
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/voluntariadoAdministrador' : '/voluntariado'} className='link_menu'>
              <span className="icon"><FaClipboardList /></span>
              Voluntariado
            </Link>
          </div>
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/suporteAdministrador' : '/suporte'} className='link_menu'>
              <span className="icon"><FaHeadphones /></span>
              Suporte
            </Link>
          </div>
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/perfilAdministrador' : '/perfil'} className='link_menu'>
              <span className="icon">{role === "Administrador" ? <FaUserShield /> : <FaUser />}</span>
              {role === "Administrador" ? 'Admin' : 'Perfil'}</Link>
          </div>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <img src="/imagens/Logo_Branco.png" alt="MeetPoint Logo" className="sidebar-logo" />
      </div>
    </aside>
  );
};

export default SidebarFixed;
