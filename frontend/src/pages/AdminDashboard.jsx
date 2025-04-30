import React from "react";
import UserInfo from "../componentes/UserInfo";
import ActionButtons from "../componentes/ActionButton";
import LogoutButton from "../componentes/LogoutButton";
import "../styles/AdminDashBoard.css"; // importa os estilos
const AdminDashboard = () => {
  return (
    <div>
      <div>
        <UserInfo />
        <ActionButtons />
      </div>
      <LogoutButton />
    </div>
  );
};

export default AdminDashboard;