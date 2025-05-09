import React, { useState, useEffect } from 'react';
import NovoAnuncio from '../componentes/novoAnuncioAdministrador';
import AnunciosCartaz from '../componentes/anunciosAdministrador';
import CandidaturasCartazAdministrador from '../componentes/candidaturaAdministrador';
import SidebarLayout from '../componentes/sidebarLayout';
import '../styles/voluntariadoAdministrador.css';

const AnunciosAdministrador = () => {
  const [showModal, setShowModal] = useState(false);
  const [anuncios, setAnuncios] = useState([]);

  const fetchAnuncios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:3000/anuncios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar anúncios");
      const data = await res.json();
      setAnuncios(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar anúncios.");
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const encerrarAnuncioLocal = (idEncerrado) => {
    setAnuncios((prev) =>
      prev.map((anuncio) =>
        anuncio.id === idEncerrado ? { ...anuncio, estado: 'Terminado' } : anuncio
      )
    );
  };

  const primeiroAnuncioAtivo = anuncios.find((a) => a.estado === 'Ativo');

  return (
    <SidebarLayout>
      <div className="voluntariado-page">
        <h2>Candidaturas Recebidas</h2>
        <div className="anuncios-grid">
          {anuncios.filter(a => a.estado === 'Ativo').length > 0
            ? anuncios
                .filter(a => a.estado === 'Ativo')
                .map(anuncioActivo => (
                  <section key={anuncioActivo.id}>
                    <h3>Candidaturas para: {anuncioActivo.cargo}</h3>
                    <CandidaturasCartazAdministrador anuncioId={anuncioActivo.id} />
                  </section>
                ))
            : <p>Sem anúncios activos para listar candidaturas.</p>
          }
        </div>
        <h2>Anúncios</h2>
        <div className="anuncios-grid">
          {anuncios.map((anuncio) => (
            <AnunciosCartaz
              key={anuncio.id}
              anuncio={anuncio}
              onEncerrar={encerrarAnuncioLocal}
            />
          ))}

          <div className="anuncio-plus" onClick={() => setShowModal(true)}>
            +
          </div>
        </div>

        {showModal && (
          <NovoAnuncio
            onClose={() => {
              setShowModal(false);
              fetchAnuncios(); // Atualiza anúncios ao fechar modal
            }}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default AnunciosAdministrador;