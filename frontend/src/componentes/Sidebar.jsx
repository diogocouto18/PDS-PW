import React, { useState } from 'react';
import SidebarFixed from './sidebarFixed'; // Importa o conteúdo completo da sidebar
import '../styles/sidebar.css'; // Usa o mesmo estilo geral

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className={`sidebar-wrapper ${isOpen ? 'open' : 'collapsed'}`}>
        {/* Botão para fechar a sidebar */}
        {isOpen && (
          <div className="sidebar-toggle-left" onClick={toggleSidebar}>
            ←
          </div>
        )}

        {/* Conteúdo da sidebar (visível só quando aberta) */}
        {isOpen && <SidebarFixed />}
      </div>

      {/* Botão quando a sidebar está fechada */}
      {!isOpen && (
        <div className="sidebar-marker" onClick={toggleSidebar}>
          →
        </div>
      )}
    </>
  );
};

export default Sidebar;
