import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import "../../styles/Perfil/perfilUtilizador.css";
import SidebarFixed from "../../componentes/Sidebar/sidebarFixed";

const PerfilUtilizador = () => {
  const [utilizador, setUtilizador] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!id || !token) {
      setError("ID ou token ausente.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/utilizadores/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do utilizador");
        return res.json();
      })
      .then((data) => {
        setUtilizador(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  if (loading) return <div className="user-container">Carregando...</div>;

  if (error) return <div className="user-container">Erro: {error}</div>;

  return (
    <div className="PerfilPage">
      <SidebarFixed />
      <div className="user-container">
        <div className="profile-section">
          <div className="user-avatar">
            <FaUserAlt size={120} />
          </div>
          <div className="user-info">
            <h2>Nome de Utilizador: {utilizador.username}</h2>
            <p><strong>Nome:</strong> {utilizador.nome}</p>
            <p><strong>Email:</strong> {utilizador.email}</p>
            <p><strong>Telefone:</strong> {utilizador.telefone}</p>
            <p><strong>Morada:</strong> {utilizador.morada}</p>
          </div>
        </div>

        <div className="user-actions">
          <button className="edituser-button">Editar Perfil</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Terminar Sessão
        </button>
      </div>
    </div>
  );
};

export default PerfilUtilizador;