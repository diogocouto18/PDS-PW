import React, { useState, useEffect, useRef } from "react";

export default function ChatBox({ mensagens, onEnviarMensagem }) {
  const [texto, setTexto] = useState("");
  const mensagensEndRef = useRef(null);

  // Scroll para o fim ao atualizar mensagens
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (texto.trim().length < 1) return;
    onEnviarMensagem(texto);
    setTexto("");
  };

  return (
    <div className="chatbox">
      <div className="mensagens-container">
        {mensagens.map((msg) => (
          <div key={msg.id} className={`mensagem ${msg.id_administrador ? "admin" : "utilizador"}`}>
            <span>{msg.mensagem}</span>
            <small>{new Date(msg.data_abertura).toLocaleString()}</small>
          </div>
        ))}
        <div ref={mensagensEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbox-form">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva sua resposta..."
          rows={3}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}