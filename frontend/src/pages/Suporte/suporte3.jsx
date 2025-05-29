import React, { useState, useEffect } from "react";
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import "../../styles/Suporte/suporte3.css";
import { FaHeadset } from "react-icons/fa";

function Suporte3() {
  const [mensagem, setMensagem] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [erroMensagem, setErroMensagem] = useState('');
  const [nome, setNome] = useState('Utilizador');
  const [idTicket, setIdTicket] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    if (!id || !token) return;

    fetch(`http://localhost:3000/utilizadores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar nome");
        return res.json();
      })
      .then((data) => setNome(data.nome))
      .catch(() => setNome('Utilizador'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mensagem.trim().length < 10) {
      setErroMensagem('A mensagem deve conter pelo menos 10 caracteres.');
      return;
    }

    setErroMensagem('');
    const token = localStorage.getItem('token');
    if (!token) return alert("Sessão inválida. Inicie sessão novamente.");

    try {
      const res = await fetch('http://localhost:3000/mensagens-suporte/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem }),
      });

      if (!res.ok) throw new Error("Erro ao enviar a mensagem");

      const data = await res.json();
      setIdTicket(data.id_ticket);
      setPopupVisible(true);
      setMensagem('');

      setTimeout(() => setPopupVisible(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a mensagem de suporte.");
    }
  };

  return (
    <SidebarLayout>
      <div className="suporte3-page">
        <div className="topbar">
          <img src="/imagens/Logo_Branco.png" alt="Logo" />
          <label className="topbar-title">Centro de Apoio</label>
        </div>

        <div className="greeting">
          <FaHeadset className="support-icon" />
          <p>Olá, <strong>{nome}</strong>! Em que podemos ajudar?</p>
        </div>

        <div className="support-form-wrapper">
          <form className="support-form" onSubmit={handleSubmit}>
            <textarea
              className="support-message"
              placeholder="Escreva aqui a sua mensagem de suporte..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />
            {erroMensagem && (
              <div className="erro-mensagem">{erroMensagem}</div>
            )}
            <button className="send-support-button" type="submit">
              Enviar Mensagem
            </button>
          </form>
        </div>

        {popupVisible && (
          <div className="popup-sucesso">
            ✅ Mensagem enviada com sucesso!
            {idTicket && (
              <div className="ticket-id">
                ID do Ticket: <strong>{idTicket}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

export default Suporte3;