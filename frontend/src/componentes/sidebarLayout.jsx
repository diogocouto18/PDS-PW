import React from 'react';
import Sidebar from './Sidebar';
import '../styles/sidebarLayout.css';

const SidebarLayout = ({ children }) => {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;