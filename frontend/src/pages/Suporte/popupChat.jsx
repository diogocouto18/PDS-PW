import React, { useEffect, useState } from 'react';
import '../../styles/Suporte/popupChat.css';

export default function ChatPopup() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [idTicket, setIdTicket] = useState(null);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  const token = localStorage.getItem('token'); // Ajusta se guardas o token noutro local

  const togglePopup = () => {
    setOpen(!open);
    setMostrarNotificacao(false);
  };

  const verificarTicket = async () => {
    try {
      const res = await fetch('http://localhost:3000/mensagens-suporte/detalhes/utilizador', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data?.id_ticket) {
        setIdTicket(data.id_ticket);
        setMensagens(data.mensagens || []);
        if (data.foiRespondido) {
          setMostrarNotificacao(true);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar ticket:', err);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/mensagens-suporte/${idTicket}/responder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem: novaMensagem }),
      });

      if (!res.ok) return;

      const nova = await res.json();
      setMensagens((prev) => [...prev, nova]);
      setNovaMensagem('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  useEffect(() => {
    verificarTicket();
  }, []);

  return (
       <>
      {mostrarNotificacao && (
        <div className="notificacao-wrapper" onClick={togglePopup}>
          <button className="notificacao-button">
            💬 Mensagem do Suporte
            <span className="bolinha-vermelha" />
          </button>
        </div>
      )}

      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Suporte Online</h3>
            <button className="close-chat" onClick={togglePopup}>×</button>
          </div>

          <div className="chat-mensagens">
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-msg ${msg.id_utilizador ? 'me' : 'them'}`}
              >
                {msg.mensagem}
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={enviarMensagem}>
            <input
              type="text"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Escreve a tua mensagem..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </>
  );
}
