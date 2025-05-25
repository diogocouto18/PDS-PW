import React, { useEffect, useState } from 'react';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';
import '../../styles/Notificacao/notificacoes.css';

const NotificacoesPage = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    if (!token || !userId) {
      setError('Não autenticado');
      setLoading(false);
      return;
    }

    const fetchNotificacoes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/notificacoes/utilizador/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.message || `Erro ${response.status}`);
        }

        const data = await response.json();
        setNotificacoes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificacoes();
  }, []);

    const abrirNotificacao = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/notificacoes/${id}/abrir`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao abrir notificação');

      // Atualiza estado local
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, estado: 'Aberto' } : n))
      );
    } 
      catch (err) {
      console.error(err);
      }
    };

    const apagarNotificacao = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/notificacoes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erro ao apagar notificação');

        setNotificacoes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.error(err);
      }
    };

  
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <SidebarLayout>
        <div className="fundo-notificacoes">
            <div className="notificacoes-container">
                <h1>As Tuas Notificações</h1>
                {notificacoes.length === 0 ? (
            <p className="status-mensagem">Não tens notificações.</p>
          ) : (
            <ul className="notificacoes-list">
              {notificacoes.map((n) => (
                <li
                  key={n.id}
                  className={`notificacao-item ${n.estado === 'Por_abrir' ? 'por-abrir' : 'lida'}`}
                  onClick={() => abrirNotificacao(n.id)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <span className="notificacao-data">
                    {new Date(n.data_envio).toLocaleString()}
                  </span>
                  <p className="notificacao-mensagem">{n.mensagem}</p>
                  <span className={`notificacao-estado ${n.estado}`}>
                    {n.estado === 'Por_abrir' ? 'Por abrir' : n.estado === 'Aberto' ? 'Lida' : n.estado}
                  </span>
                  <button
                    className="btn-apagar"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      apagarNotificacao(n.id);
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

export default NotificacoesPage;
