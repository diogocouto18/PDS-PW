import React, { useState, useEffect } from 'react';
import '../styles/novoAnuncioAdministrador.css';

const NovoAnuncio = ({ onClose }) => {
  const [cargo, setCargo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idEvento, setIdEvento] = useState('');
  const [estado, setEstado] = useState('Ativo');
  const [eventos, setEventos] = useState([]);

  
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:3000/eventos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Erro ao carregar eventos');
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar eventos.");
      }
    };

    fetchEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch('http://localhost:3000/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cargo,
          descricao,
          id_evento: parseInt(idEvento),
          estado
        })
      });

      if (!res.ok) throw new Error('Erro ao criar anúncio');

      alert('Anúncio criado com sucesso!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar anúncio.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Anúncio</h2>
          <form onSubmit={handleSubmit}>
            <label>Cargo</label>
            <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} required/>

            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>

            <label>Evento</label>
            <select value={idEvento} onChange={(e) => setIdEvento(e.target.value)} required>
              <option value="">Selecione um evento</option>
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.titulo}
                  </option>
                ))}
            </select>

          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Ativo">Ativo</option>
            <option value="Terminado">Terminado</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">Criar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAnuncio;
