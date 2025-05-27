import React from 'react';
import "../../styles/PopUp.css";
import "../../styles/Eventos/criarEvento.css";


const DetalhesEvento = ({ isOpen, onClose, evento }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{evento.titulo}</h2>
        <p><strong>Categoria:</strong> {evento.categoria}</p>
        <p><strong>Localização:</strong> {evento.localizacao}</p>
        <p><strong>Descrição:</strong> {evento.descricao}</p>
      </div>
    </div>
  );
};

export default DetalhesEvento;
