import React, { useState } from 'react';
import SidebarFixed from './sidebarFixed'; // Importa o conteúdo completo da sidebar
import '../../styles/Sidebar/sidebar.css'; // Usa o mesmo estilo geral

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className={`sidebar-wrapper ${isOpen ? 'open' : 'collapsed'}`}>
        {isOpen && (
          <div className="sidebar-toggle-left" onClick={toggleSidebar}>
            ←
          </div>
        )}
        {isOpen && <SidebarFixed />}
      </div>

      {!isOpen && (
        <div className="sidebar-marker" onClick={toggleSidebar}>
          →
        </div>
      )}
    </>
  );
};

export default Sidebar;
