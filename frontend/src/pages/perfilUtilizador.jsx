import React, { useEffect, useState } from 'react';
import Sidebar from '../componentes/Sidebar';
import '../styles/perfilUtilizador.css';
import { FaUser } from 'react-icons/fa';

function PerfilUtilizador() {
  const [utilizador, setUtilizador] = useState(null);

  const utilizadorId = localStorage.getItem('id');

  useEffect(() => {
    if (utilizadorId) {
      fetch(`http://localhost:3000/utilizadores/${utilizadorId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Envia o token de autorização
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Erro ao buscar perfil');
          }
          return res.json(); // Retorna a resposta como JSON
        })
        .then((data) => {
          setUtilizador(data); // Armazena os dados recebidos no estado
        })
        .catch((err) => {
          console.error('Erro ao buscar perfil:', err); // Lida com qualquer erro
        });
    }
  }, [utilizadorId]); 

  if (!utilizador) return <p>Carregando perfil...</p>;

  return (
    <div className="perfil-page">
      <Sidebar />
      <div className="perfil-container">
        <div className="perfil-foto-info">
          <div className="foto-box">
            <div className="foto-placeholder"><span className="icon"><FaUser /></span></div>
          </div>
          <div className="info-box">
            <h1>{utilizador.username}</h1>
            <strong>{utilizador.nome}</strong>
            <p>{utilizador.email}</p>
            <p>{utilizador.telefone}</p>
            <p>{utilizador.morada}</p>
            <p>{utilizador.codigo_postal} {utilizador.localidade}</p>
            <p className="doados">Total Doado: <strong>{utilizador.total_doado || 0}€</strong></p>
          </div>
        </div>

        <div className="botoes-box">
          <button className="btn-editar">Editar Perfil</button>
          <button className="btn-terminar">Terminar Sessão</button>
        </div>

        <div className="detalhes">
          <div className="secao">
            <h3>Candidaturas Voluntariado</h3>
            {utilizador.voluntariado?.map((item, i) => (
              <div key={i}>
                <p>{item.nome}</p>
                <p><strong>Estado</strong>: {item.estado}</p>
              </div>
            )) || <p>Sem candidaturas</p>}
          </div>

          <div className="secao">
            <h3>Estado rifas</h3>
            {utilizador.rifas?.map((rifa, i) => (
              <div key={i}>
                <p>{rifa.nome}</p>
                <p><strong>{rifa.foiVencedor ? 'Vencedor' : 'Não Vencedor'}</strong></p>
              </div>
            )) || <p>Sem rifas</p>}
          </div>

          <div className="secao">
            <h3>Histórico Doações</h3>
            {utilizador.doacoes?.length > 0 ? (
              utilizador.doacoes.map((d, i) => (
                <p key={i}>{d.data} - {d.descricao} <span className="valor">{d.valor}€</span></p>
              ))
            ) : (
              <p>Sem doações registadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUtilizador;
