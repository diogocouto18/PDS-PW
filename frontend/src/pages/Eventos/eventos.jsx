import React, { useState, useEffect } from 'react';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import SearchBar from "../../componentes/searchbar";
import Filter from "../../componentes/filters";
import { FaShareAlt } from 'react-icons/fa';
import '../../styles/Eventos/ListaEventos.css';
import { Link } from 'react-router-dom';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/eventos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar eventos');
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar eventos.');
      }
    };

    fetchEventos();
  }, []);

  return (
    <SidebarLayout>
      <div className="lista-eventos">
        <div className="search-container">
          <SearchBar />
        </div>
        <h2>Eventos</h2>
        <div className='Filtro'>
          <Filter />
        </div>

        {eventos.length === 0 ? (
          <p>Não há eventos disponíveis.</p>
        ) : (
          <div className="eventos-container">
            {eventos.map((evento) => (
              <div className="evento-card" key={evento.id}>
                <div className="evento-header">
                  <span className="evento-data">
                    {new Date(evento.data_evento).toLocaleDateString('pt-PT')}
                  </span>
                  <span className="evento-nome">{evento.titulo}</span>
                </div>

                {evento.fotografia && (
                  <img
                    src={`http://localhost:3000/uploads/${evento.fotografia}`}
                    alt={evento.titulo}
                    className="evento-imagem"
                  />
                )}

                <div className="evento-footer">
                  <button className="evento-share-btn">
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Eventos;