import React from 'react';
import SidebarLayout from "../componentes/sidebarLayout"
import SearchBar from "../componentes/searchbar";
import Filter from "../componentes/filters";
import { FaShareAlt } from 'react-icons/fa'; // Ícone de compartilhamento
import '../styles/ListaEventos.css';
import { Link } from 'react-router-dom';

const Eventos = ({ eventos = []  }) => {
  return (
<SidebarLayout>
    <div className="lista-eventos">
        <div className="search-container">
                    <SearchBar />
        </div>
      <h2>Eventos</h2>
      <div className='Eventos'>
        <div>
            <Filter />
        </div>
      </div>
      {eventos.length === 0 ? (
        <p>Não há eventos disponíveis.</p>
      ) : (
        <div className="eventos-container">
          {eventos.map((evento) => (
            <div className="evento-card" key={evento.id}>
              <div className="evento-header">
                <span className="evento-data">{evento.data}</span>
                <span className="evento-nome">{evento.nome}</span>
              </div>
              {evento.imagem && (
                <img
                  src={`http://localhost:3000/uploads/${evento.imagem}`}
                  alt={evento.nome}
                  className="evento-imagem"
                />
              )}
              <button className="evento-share-btn">
                <FaShareAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </SidebarLayout>
  );
};

export default Eventos;
