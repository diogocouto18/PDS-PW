import React, { useEffect, useState } from 'react';
import '../styles/candidaturaAdministrador.css';

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

  if (!candidaturas.length) return <p>Sem candidaturas para este anúncio.</p>;

  return (
    <div className="candidaturas-grid">
      {candidaturas.map((c) => (
        <div key={c.id} className="anuncio-card">
          <p><strong>Voluntário:</strong> {c.Utilizador?.username || 'Desconhecido'}</p>
          <p><strong>Mensagem:</strong> {c.mensagem || '—'}</p>
          <p><strong>Estado:</strong> {c.estado}</p>
          <select
            value={c.estado}
            onChange={(e) => handleAvaliacao(c.id, e.target.value)}
          >
            <option value="Pendente">Pendente</option>
            <option value="Aceite">Aceite</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default CandidaturasCartazAdministrador;
