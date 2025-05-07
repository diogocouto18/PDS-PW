import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebarFixed.css';
import { FaEnvelope, FaCalendarAlt, FaClipboardList, FaHeadphones, FaUserShield, FaUser , FaBars } from 'react-icons/fa';

const SidebarFixed = () => {

  const role = localStorage.getItem('role');
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <FaEnvelope className="sidebar-icon" />
      </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-item">
            <Link to='/menu' className='link_menu'> <span className="icon"><FaBars /></span>Menu</Link>
          </div>
          <div className="menu-item">
            <Link to='/eventos' className='link_menu'> <span className="icon"><FaCalendarAlt /></span>Eventos</Link>
          </div>
          <div className="menu-item">
            <Link to='/voluntariado' className='link_menu'> <span className="icon"><FaClipboardList /></span>Voluntariado</Link>
          </div>
          <div className="menu-item">
            <Link to='/suporte' className='link_menu'> <span className="icon"><FaHeadphones /></span>Suporte</Link>
          </div>
          <div className="menu-item">
            <Link to={role === "Administrador" ? '/admin' : '/perfil'} className='link_menu'>
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
