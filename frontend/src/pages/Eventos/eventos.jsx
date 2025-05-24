import React, { useState, useEffect } from 'react';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import SearchBar from "../../componentes/searchbar";
import Filter from "../../componentes/filters";
import { FaShareAlt } from 'react-icons/fa';
import '../../styles/Eventos/ListaEventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Função para buscar eventos, pode buscar todos ou filtrar pela pesquisa
  const fetchEventos = async (termo = '') => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3000/eventos/';

      if (termo.trim() !== '') {
        url = `http://localhost:3000/eventos/pesquisar?q=${encodeURIComponent(termo)}`;
      }

      const res = await fetch(url, {
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

  // Carrega todos eventos ao montar o componente
  useEffect(() => {
    fetchEventos();
  }, []);

  // Atualiza eventos sempre que o termo de pesquisa mudar
  useEffect(() => {
    fetchEventos(termoPesquisa);
  }, [termoPesquisa]);

  return (
    <SidebarLayout>
      <div className="lista-eventos">
        <div className="search-container">
          <SearchBar onSearch={setTermoPesquisa} />
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
                  <span className="evento-nome">{evento.titulo}</span>
                  <span className="evento-data">
                    {new Date(evento.data_evento).toLocaleDateString('pt-PT')}
                  </span>
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
