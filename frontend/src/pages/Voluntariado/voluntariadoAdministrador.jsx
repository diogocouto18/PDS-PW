import React, { useState, useEffect } from 'react';
import NovoAnuncio from '../../componentes/Voluntariado/novoAnuncioAdministrador';
import AnunciosCartaz from '../../componentes/Voluntariado/anunciosAdministrador';
import CandidaturasCartazAdministrador from '../../componentes/Voluntariado/candidaturaAdministrador';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';
import '../../styles/Voluntariado/voluntariadoAdministrador.css';

const AnunciosAdministrador = () => {
  const [showModal, setShowModal] = useState(false);
  const [anuncios, setAnuncios] = useState([]);
  const [verMaisAnuncios, setVerMaisAnuncios] = useState(false);
  const [verMaisCandidaturas, setVerMaisCandidaturas] = useState(false);
  const MAX_VISIVEIS = 1;

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:3000/anuncios', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar anúncios");
        const data = await res.json();
        setAnuncios(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar anúncios.");
      }
    };

    fetchAnuncios();
  }, []);

  const encerrarAnuncioLocal = (idEncerrado) => {
    setAnuncios(prev =>
      prev.map(a =>
        a.id === idEncerrado ? { ...a, estado: 'Terminado' } : a
      )
    );
  };

  const anunciosAtivos = anuncios.filter(a => a.estado === 'Ativo');
  const candidaturasVisiveis = verMaisCandidaturas ? anunciosAtivos : anunciosAtivos.slice(0, MAX_VISIVEIS);
  const anunciosVisiveis = verMaisAnuncios ? anuncios : anuncios.slice(0, MAX_VISIVEIS);

  return (
    <SidebarLayout>
      <div className="voluntariado-pages">
        <div className="section-header">
        <h2>Candidaturas Recebidas</h2>
        {anunciosAtivos.length > MAX_VISIVEIS && (
          <button className="toggle-btn" onClick={() => setVerMaisCandidaturas(v => !v)}>
            {verMaisCandidaturas ? 'Mostrar menos' : 'Mostrar todas'}
          </button>
        )}
        </div>
        <div className="candidaturas-container">
          {anunciosAtivos.length > 0 ? (
            candidaturasVisiveis.map(anuncio => (
              <section key={anuncio.id} className="candidatura-section">
                <h3>Candidaturas para: {anuncio.cargo}</h3>
                <CandidaturasCartazAdministrador anuncioId={anuncio.id} />
              </section>
            ))
          ) : (
            <p>Sem anúncios ativos.</p>
          )}
        
        </div>

        <div className="section-header">
          <h2>Anúncios</h2>
          {anuncios.length > MAX_VISIVEIS && (
            <button className="toggle-btn" onClick={() => setVerMaisAnuncios(v => !v)}>
              {verMaisAnuncios ? 'Mostrar menos' : 'Mostrar todos'}
            </button>
          )}
        </div>
        <div className="anuncios-container">
          {anunciosVisiveis.map(anuncio => (
            <AnunciosCartaz key={anuncio.id} anuncio={anuncio} onEncerrar={encerrarAnuncioLocal} />
          ))}
          <div className="anuncio-plus" onClick={() => setShowModal(true)}>+</div>
        </div>

      

        {showModal && (
          <NovoAnuncio
            onClose={() => {
              setShowModal(false);
              // Atualiza após fechar
              const token = localStorage.getItem("token");
              fetch('http://localhost:3000/anuncios', {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then(res => res.json())
                .then(setAnuncios)
                .catch(err => console.error(err));
            }}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default AnunciosAdministrador;
