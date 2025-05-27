import React, { useEffect, useState } from "react";
import "../../styles/Perfil/perfilUtilizador.css";
import SidebarFixed from "../../componentes/Sidebar/sidebarFixed";
import { FaUserAlt } from "react-icons/fa";

const PerfilAdministrador = () => {
  const [administrador, setAdministrador] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!id || !token) {
      setError("ID ou token ausente.");
      return;
    }

    fetch(`http://localhost:3000/administradores/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar dados do administrador");
        }
        return res.json();
      })
      .then((data) => setAdministrador(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  if (error) {
    return <div className="admin-container">Erro: {error}</div>;
  }

  if (!administrador) {
    return <div className="admin-container">Carregando...</div>;
  }

  return (
    <div className="PerfilPage">
      <SidebarFixed />
      <div className="admin-container">
        <div className="profile-section">
          <div className="admin-avatar">
            <FaUserAlt/>
          </div>
          <div className="admin-info">
            <h2>Nome Utilizador: {administrador.username}</h2>
            <p><strong>Nome: {administrador.nome}</strong></p>
            <p>Email: {administrador.email}</p>
          </div>
        </div>

        <div className="admin-actions">
          <button className="admin-button">Sortear Rifas</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Terminar Sessão
        </button>
      </div>
    </div>  
  );
};

export default PerfilAdministrador;