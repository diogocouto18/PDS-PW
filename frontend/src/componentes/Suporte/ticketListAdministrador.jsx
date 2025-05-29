import React from "react";

export default function TicketList({ tickets, onSelectTicket, ticketSelecionado }) {
  return (
    <div className="ticket-list">
      <h2>Tickets Abertos</h2>
      {tickets.length === 0 && <p>Nenhum ticket encontrado.</p>}
      <ul>
        {tickets.map((ticket) => (
          <li
            key={ticket.id_ticket}
            className={ticketSelecionado?.id_ticket === ticket.id_ticket ? "selecionado" : ""}
            onClick={() => onSelectTicket(ticket)}
          >
            <strong>ID:</strong> {ticket.id_ticket} <br />
            <small>{ticket.resumo}...</small> <br />
            <small>Utilizador: {ticket.username}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}