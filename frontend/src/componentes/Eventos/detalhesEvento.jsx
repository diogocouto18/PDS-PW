import React, { useEffect, useState } from 'react';
import "../../styles/PopUp.css";
import "../../styles/Eventos/detalhesEvento.css";

const DetalhesEvento = ({ isOpen, onClose, evento, token }) => {
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      if (evento.id_categoria) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/categoria-evento/${evento.id_categoria}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar categoria: ${response.status}`);
          }

          const data = await response.json();
          console.log("Categoria recebida da API:", data);
          setCategoria(data);

        } catch (error) {
          console.error("Erro no fetch da categoria:", error);
          setCategoria(null);
        }
      }
    };

    if (isOpen) {
      fetchCategoria();
    } else {
      setCategoria(null); // limpa categoria ao fechar modal
    }
  }, [evento, isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        {evento.fotografia && (
          <img
            src={`http://localhost:3000/uploads/${evento.fotografia}`}
            alt={evento.titulo}
            className="evento-imagem"
          />
        )}

        <div className="divider"></div>

        <div className="evento-info">
          <div className="info-item horizontal">
            <p className="label-title">{evento.titulo}</p>
            <p className="label">{new Date(evento.data_evento).toLocaleDateString('pt-PT')}</p>
          </div>

          <p className="label">Localizacao: {evento.localizacao}</p>
          <p className="label">Categoria: {categoria ? categoria.nome : evento.id_categoria}</p>
        </div>

        <div className="divider"></div>

        <div className="descricao-item">
          <p className="label">📝 Descrição</p>
          <p>{evento.descricao}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-share">Partilhar</button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;