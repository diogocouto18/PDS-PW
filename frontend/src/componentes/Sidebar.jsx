import React, { useState } from 'react';
import '../styles/Sidebar.css';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaCalendarAlt, FaClipboardList, FaHeadphones, FaUser , FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="top-icons">
          {isOpen && <div className="icon">✉</div>}
          <div className="icon toggle-button" onClick={toggleSidebar}>
            {isOpen ? '←' : ''}
          </div>
        </div>

        {isOpen && (
          <>
            <div className="menu-section">
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
                              <Link to='/perfil' className='link_menu'> <span className="icon"><FaUser /></span>Admin</Link>
                            </div>
                      </div>
            </div>

            <div className="logo_branco">
              <img src="/imagens/Logo_Branco.png" alt="Logo MeetPoint" />
            </div>
          </>
        )}
      </div>

      {/* Botão marcador fixo fora do menu */}
      {!isOpen && (
        <div className="sidebar-marker" onClick={toggleSidebar}>
          <span className="open-button">→</span>
        </div>
      )}
    </>
  );
};

export default Sidebar;
