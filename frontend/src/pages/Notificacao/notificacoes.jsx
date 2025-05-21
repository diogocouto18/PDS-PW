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
          }
        );

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

  if (loading) return <p>Carregando notificações…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <SidebarLayout>
        <div className="fundo-notificacoes">
            <div className="notificacoes-container">
                <h1>As Tuas Notificações</h1>
                {loading && (
                    <p className="status-mensagem">Carregando notificações…</p>
                )}
                {error && (
                    <p className="status-mensagem erro">{error}</p>
                )}

                {!loading && !error && notificacoes.length === 0 && (
                    <p className="status-mensagem">Não tens notificações.</p>
                )}

                {!loading && !error && notificacoes.length > 0 && (
                    <ul className="notificacoes-list">
                        {notificacoes.map((n) => (
                            <li key={n.id}>
                                <span className="notificacao-data">
                                    {new Date(n.data_envio).toLocaleString()}
                                </span>
                                <p className="notificacao-mensagem">{n.mensagem}</p>
                                <span className={`notificacao-estado ${n.estado}`}>
                                    {n.estado === 'Por_abrir' ? 'Por abrir' : 'Lida'}
                                </span>
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
