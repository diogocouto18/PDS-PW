import React from 'react';
import '../../styles/Voluntariado/candidaturaUtilizador.css';

const CandidaturaCartazUtilizador = ({ candidatura, onRemove }) => {
    const { id, estado, Anuncio } = candidatura;
  
    const cargo     = Anuncio?.cargo    ?? 'Cargo não disponível';
    const nomeEvento= Anuncio?.Evento?.titulo ?? 'Evento não disponível';
    
    const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Aceite':
        return 'badge badge-aceite';
      case 'Rejeitado':
        return 'badge badge-rejeitada';
      default:
        return 'badge badge-pendente';
    }
    };

    return (
        <div className="candidatura-card-utilizador">
            {onRemove && (
                <button
                  className="remove-btn"
                  onClick={() => onRemove(id)}
                  title="Remover candidatura"
                >
                  &times;
                </button>
            )}
            <div className="dados-candidatura">
                <span className={getBadgeClass(estado)}>{estado}</span>
                <p className="cargo">{cargo}</p>
                <p className="evento"><strong>Evento:</strong> {nomeEvento}</p>
            </div>
        </div>
    );
};

export default CandidaturaCartazUtilizador;