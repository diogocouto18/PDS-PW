import React, { useState, useEffect } from 'react';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import SearchBar from "../../componentes/searchbar";
import Filter from "../../componentes/filters";
import { FaShareAlt } from 'react-icons/fa';
import '../../styles/Eventos/ListaEventos.css';
import DetalhesEvento from '../../componentes/Eventos/detalhesEvento.jsx';
import EstrelasAvaliacao from '../../componentes/Eventos/EstrelasAvaliacao.jsx';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [copiedEventId, setCopiedEventId] = useState(null);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const handleCardClick = (evento) => {
    setSelectedEvento(evento);
  };

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

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    fetchEventos(termoPesquisa);
  }, [termoPesquisa]);

  const copiarLink = async (eventoId) => {
    const link = `${window.location.origin}/eventos/${eventoId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedEventId(eventoId);
      setTimeout(() => setCopiedEventId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar o link:", err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'Administrador') {
      setMostrarBotao(true);
    }
  }, []);

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
              <div className="evento-card">
                <div className="evento-header" key={evento.id} onClick={() => handleCardClick(evento)}>
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
                  <div className="footer-left">
                    <EstrelasAvaliacao idEvento={evento.id} />
                  </div>

                  <div className="footer-right">
                    <button
                      className="evento-share-btn"
                      onClick={(e) => { e.stopPropagation(); copiarLink(evento.id); }}
                    >
                      <FaShareAlt />
                    </button>

                    {copiedEventId === evento.id && (
                      <span className="copied-alert">✅ Link copiado!</span>
                    )}

                    {mostrarBotao && (
                      <button className='eventoEditButton'>Editar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DetalhesEvento
        isOpen={!!selectedEvento}
        onClose={() => setSelectedEvento(null)}
        evento={selectedEvento}
      />
    </SidebarLayout>
  );
};

export default Eventos;
