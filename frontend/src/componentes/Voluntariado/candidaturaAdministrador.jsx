import React, { useEffect, useState } from 'react';
import '../../styles/Voluntariado/candidaturaAdministrador.css';

const CandidaturasCartazAdministrador = ({ anuncioId }) => {
  const [candidaturas, setCandidaturas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/candidaturaVoluntariado/anuncio/${anuncioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(setCandidaturas)
      .catch((err) => console.error("Erro ao buscar candidaturas:", err));
  }, [anuncioId]);

  const handleAvaliacao = async (id, novoEstado) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/candidaturaVoluntariado/${id}/avaliar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: novoEstado })
    });

    if (res.ok) {
      setCandidaturas(prev => prev.map(c => c.id === id ? { ...c, estado: novoEstado } : c));
    } else {
      alert('Erro ao atualizar estado da candidatura.');
    }
  };

  //if (!candidaturas.length) return <p>Sem candidaturas para este anúncio.</p>;

  return (
    <div className="candidaturas-grid">
      
      {candidaturas.map((c) => (
        <div key={c.id} className="anuncio-card">
          <p><strong>Evento:</strong> {c.Anuncio?.Evento?.titulo || 'Sem nome'}</p>
          <p><strong>Voluntário:</strong> {c.Utilizador?.username || 'Desconhecido'}</p>
          <p><strong>Mensagem:</strong></p>
          <div className="mensagem-scroll">{c.mensagem || '—'}</div>
          <p><strong>Estado:</strong> {c.estado}</p>
          
          {c.estado === 'Pendente' && (
            <div className="candidaturas-grid__botoes">
              <button  onClick={() => handleAvaliacao(c.id, 'Aceite')}>Aceitar</button>
              <button  onClick={() => handleAvaliacao(c.id, 'Rejeitado')}>Rejeitar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidaturasCartazAdministrador;
