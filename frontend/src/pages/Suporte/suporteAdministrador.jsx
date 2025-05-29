import React, { useState, useEffect } from "react";
import TicketList from "../../componentes/Suporte/ticketListAdministrador";
import ChatBox from "../../componentes/Suporte/chatboxAdministrador";
import "../../styles/Suporte/suporteAdministrador.css";
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";

function SuporteAdministrador() {
  const [tickets, setTickets] = useState([]);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);

  const token = localStorage.getItem("token");

useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3000/mensagens-suporte/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar tickets");
        return res.json();
      })
      .then((data) => setTickets(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Buscar mensagens ao selecionar um ticket
  useEffect(() => {
    if (!ticketSelecionado || !token) return;

    fetch(`http://localhost:3000/mensagens-suporte/${ticketSelecionado.id_ticket}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar mensagens do ticket");
        return res.json();
      })
      .then((data) => setMensagens(data))
      .catch((err) => console.error(err));
  }, [ticketSelecionado, token]);

  // Função para enviar nova mensagem (passa para o backend)
  const enviarMensagem = async (texto) => {
    if (!ticketSelecionado) return;

    try {
      const res = await fetch(`http://localhost:3000/mensagens-suporte/${ticketSelecionado.id_ticket}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem: texto }),
      });

      if (!res.ok) throw new Error("Erro ao enviar mensagem");

      const novaMensagem = await res.json();
      setMensagens((prev) => [...prev, novaMensagem]);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mensagem.");
    }
  };

  return (
    <SidebarLayout>
      <div className="suporte-admin-container">
        <TicketList tickets={tickets} onSelectTicket={setTicketSelecionado} ticketSelecionado={ticketSelecionado} />

        {ticketSelecionado ? (
          <ChatBox mensagens={mensagens} onEnviarMensagem={enviarMensagem} />
        ) : (
          <div className="nenhum-ticket-selecionado">Selecione um ticket para começar a responder.</div>
        )}
      </div>
        

    </SidebarLayout>
  );
}

export default SuporteAdministrador;