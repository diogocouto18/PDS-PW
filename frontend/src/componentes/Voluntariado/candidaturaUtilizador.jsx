import React from 'react';
import '../../styles/Voluntariado/candidaturaUtilizador.css';

const CandidaturaCartazUtilizador = ({ candidatura, onRemove }) => {
    const { id, Anuncio } = candidatura;
  
    const cargo     = Anuncio?.cargo    ?? 'Cargo não disponível';
    const nomeEvento= Anuncio?.Evento?.titulo ?? 'Evento não disponível';

    return (
        <div className="candidatura-card-utilizador">
            <button
                className="remove-btn" onClick={() => onRemove(id)} title="Remover candidatura">
                &times;
            </button>
            <div className="dados-candidatura">
                <p className="cargo">{cargo}</p>
                <p className="evento"><strong>Evento:</strong> {nomeEvento}</p>
            </div>
        </div>
    );
};

export default CandidaturaCartazUtilizador;