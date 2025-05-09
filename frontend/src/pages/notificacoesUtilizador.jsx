import React, { useEffect, useState } from 'react';
import '../styles/notificacoesUtilizador.css';

function NotificacoesUtilizador() {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await fetch('/api/utilizador/notificacoes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Erro ao encontrar notificações.');

        const data = await response.json();
        setNotificacoes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotificacoes();
  }, []);

  const getCorIcone = (tipo) => {
    return tipo === 'positivo' ? 'verde' : 'vermelho';
  };

  return (
    <div className="notificacoes-container">
      <div className="notificacoes-titulo">
        <span role="img" aria-label="envelope">📩</span> Notificações
      </div>
      <div className="notificacoes-lista">
        {notificacoes.map((notif, i) => (
          <div key={i} className="notificacao-item">
            <span className={`icone ${getCorIcone(notif.tipo)}`}></span>
            <span
              dangerouslySetInnerHTML={{ __html: notif.mensagem }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificacoesUtilizador;
