import React, { useState } from 'react';
import '../../styles/Voluntariado/novoCandidatura.css';

const NovaCandidatura = ({ anuncio, onClose, onSuccess }) => {
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/candidaturaVoluntariado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_anuncio: anuncio.id,   // envia só o ID do anúncio
          mensagem: mensagem
        })
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao candidatar');
      }
  
      alert('Candidatura enviada!');
      onSuccess();  // atualiza lista de candidaturas no pai, se quiseres
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Candidatar-me: {anuncio.cargo}</h2>
        <form onSubmit={handleSubmit}>
          <label>Mensagem para se Candidatar</label>
          <textarea
            rows="4"
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit">Enviar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaCandidatura;
