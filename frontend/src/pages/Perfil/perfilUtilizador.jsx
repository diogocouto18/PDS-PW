import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import "../../styles/Perfil/perfilUtilizador.css";
import SidebarFixed from "../../componentes/Sidebar/sidebarFixed";

const PerfilUtilizador = () => {
  const [utilizador, setUtilizador] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (!id || !token) return setLoading(false);

    fetch(`http://localhost:3000/utilizadores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do utilizador");
        return res.json();
      })
      .then((data) => {
        setUtilizador(data);
        setForm({
          username: data.username,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          morada: data.morada,
        });
      })
      .catch(() => setMsg({ text: "Erro ao carregar perfil", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (msg.type === "success") {
      const timer = setTimeout(() => setMsg({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefone" && value && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const saveChanges = async () => {
    if (!form.username || !form.nome || !form.telefone || !form.morada) {
      setMsg({ text: "Preencha todos os campos", type: "error" });
      return;
    }
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/utilizadores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          nome: form.nome,
          telefone: form.telefone,
          morada: form.morada,
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar perfil");
      const updated = await res.json();
      setUtilizador(updated);
      setEditing(false);
      setMsg({ text: "Dados alterados com sucesso", type: "success" });
    } catch (e) {
      setMsg({ text: e.message || "Erro ao salvar", type: "error" });
    }
  };



  return (
    <div className="PerfilPage">
      <SidebarFixed />
      <div className="user-container">

        {/* ✅ Mensagem de erro ou sucesso centralizada */}
        {msg.text && !editing && (
          <div
            style={{
              color: msg.type === "error" ? "red" : "green",
              marginBottom: 10,
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            {msg.text}
          </div>
        )}

        <div className="profile-section">
          <div className="user-avatar">
            <FaUserAlt size={120} />
          </div>
          <div className="user-info">
            <h2>Nome de Utilizador: {utilizador?.username}</h2>
            <p><strong>Nome:</strong> {utilizador?.nome}</p>
            <p><strong>Email:</strong> {utilizador?.email}</p>
            <p><strong>Telefone:</strong> {utilizador?.telefone}</p>
            <p><strong>Morada:</strong> {utilizador?.morada}</p>
          </div>
        </div>

        <div className="user-actions">
          <button className="edituser-button" onClick={() => { setEditing(true); setMsg({ text: "", type: "" }); }}>
            Editar Perfil
          </button>
        </div>

        <button className="logout-button" onClick={handleLogout}>Terminar Sessão</button>

        {editing && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={() => setEditing(false)}>&times;</button>
              <h3>Editar Perfil</h3>
              <form onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
                <label>Username:
                  <input name="username" value={form.username} onChange={handleChange} />
                </label>
                <label>Nome:
                  <input name="nome" value={form.nome} onChange={handleChange} />
                </label>
                <label>Email:
                  <input name="email" value={form.email} disabled />
                </label>
                <label>Telefone:
                  <input name="telefone" value={form.telefone} onChange={handleChange} />
                </label>
                <label>Morada:
                  <input name="morada" value={form.morada} onChange={handleChange} />
                </label>

                {msg.text && (
                  <div style={{ color: msg.type === "error" ? "red" : "green", margin: "10px 0", fontWeight: "bold", textAlign: "center" }}>
                    {msg.text}
                  </div>
                )}

                <button type="submit">Confirmar</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilUtilizador;
