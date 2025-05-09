import React from 'react';
import '../styles/anunciosUtilizador.css';

const AnunciosCartazUtilizador = ({ anuncio, onCandidatar }) => {
  const { cargo, descricao, estado, data_publicacao, Evento } = anuncio;

  return (
    <div className="anuncio-card-utilizador">
      <h3>{cargo}</h3>
      <p><strong>Evento:</strong> {Evento?.titulo || '—'}</p>
      <p><strong>Descrição:</strong>{descricao}</p>
      <p><strong>Publicado:</strong> {new Date(data_publicacao).toLocaleDateString('pt-PT')}</p>
      <button
        className="candidatar-btn"
        onClick={() => onCandidatar(anuncio)}
        disabled={estado !== 'Ativo'}
      >
        {estado === 'Ativo' ? 'Candidatar' : 'Fechado'}
      </button>
    </div>
  );
};

export default AnunciosCartazUtilizador;