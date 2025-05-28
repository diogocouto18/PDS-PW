import React, { useState } from 'react';
import './popupChat.css';

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([
    { remetente: 'admin', texto: 'Olá! Como posso ajudar?' }
  ]);

  const togglePopup = () => setOpen(!open);

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (mensagem.trim() === '') return;

    setConversa([...conversa, { remetente: 'utilizador', texto: mensagem }]);
    setMensagem('');
  };

  return (
    <>
      <div className="notificacao-wrapper" onClick={togglePopup}>
        <button className="notificacao-button">
          💬 Mensagem do Suporte
          <span className="bolinha-vermelha" />
        </button>
      </div>

      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Suporte Online</h3>
            <button className="close-chat" onClick={togglePopup}>×</button>
          </div>

          <div className="chat-mensagens">
            {conversa.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-msg ${msg.remetente === 'utilizador' ? 'me' : 'them'}`}
              >
                {msg.texto}
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={enviarMensagem}>
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Escreve a tua mensagem..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </>
  );
}
