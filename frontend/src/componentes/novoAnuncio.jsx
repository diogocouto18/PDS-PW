import React from 'react';
import '../styles/novoAnuncio.css';

const NovoAnuncio = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>

        <form className="modal-form">
          <label>Evento</label>
          <input type="text" placeholder="Nome do evento" />

          <label>Atividade</label>
          <input type="text" placeholder="Atividade" />

          <label>Descrição</label>
          <textarea placeholder="Descrição detalhada..." />

          <button type="submit">Criar</button>
        </form>
      </div>
    </div>
  );
};

export default NovoAnuncio;