import React, { useState, useEffect } from 'react';
import AnunciosCartazUtilizador from '../../componentes/Voluntariado/anunciosUtilizador';
import NovaCandidatura from '../../componentes/Voluntariado/novoCandidatura';
import CandidaturaCartazUtilizador from '../../componentes/Voluntariado/candidaturaUtilizador';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';
import '../../styles/Voluntariado/voluntariadoUtilizador.css';

const Voluntariado = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1) buscar anúncios
    fetch('http://localhost:3000/anuncios', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setAnuncios)
      .catch(() => alert("Erro ao carregar anúncios."));

    // 2) buscar minhas candidaturas
    fetch('http://localhost:3000/candidaturaVoluntariado/minhas', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCandidaturas(data))
      .catch(() => console.error("Erro ao carregar candidaturas"));
  }, []);

  const handleCandidatar = anuncio => {
    setSelected(anuncio);
    setShowModal(true);
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Deseja mesmo remover esta candidatura?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/candidaturaVoluntariado/candidaturas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setCandidaturas(prev => prev.filter(c => c.id !== id));
  };

  const onClose = () => {
    setShowModal(false);
    setSelected(null);
  };

  const onSuccess = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:3000/candidaturaVoluntariado/minhas', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setCandidaturas)
      .catch(() => console.error("Erro ao recarregar candidaturas"));
    onClose();
  };

  return (
    <SidebarLayout>
      <div className="voluntariado-page">
      
      <h2>Resultados</h2>
      <div className="candidaturas-grid">
        {candidaturas.filter(c => c.estado === "Aceite" || c.estado === "Rejeitado").length > 0 ? (
          candidaturas
            .filter(c => c.estado === "Aceite" || c.estado === "Rejeitado")
            .map(c => (
              <CandidaturaCartazUtilizador
                key={c.id}
                candidatura={c}
                onRemove={c.estado === "Rejeitado" ? () => handleRemove(c.id) : null}
              />
            ))
        ) : (
          <p>Ainda não tens resultados disponíveis.</p>
        )}
      </div>


      <h2>Candidaturas Enviadas</h2>
      <div className="candidaturas-grid">
        {candidaturas.filter(c => c.estado !== "Aceite" && c.estado !== "Rejeitado").length > 0 ? (
          candidaturas
            .filter(c => c.estado !== "Aceite" && c.estado !== "Rejeitado")
            .map(c => (
              <CandidaturaCartazUtilizador
                key={c.id}
                candidatura={c}
                onRemove={() => handleRemove(c.id)}
              />
            ))
        ) : (
          <p>Não tens candidaturas pendentes.</p>
        )}
      </div>


      <h2>Anúncios Disponíveis</h2>
        <div className="anuncios-grid">
          {anuncios.length > 0 ? (
            anuncios.map(a => (
              <AnunciosCartazUtilizador
                key={a.id}
                anuncio={a}
                onCandidatar={handleCandidatar}
              />
            ))
          ) : (
            <p>Ainda não existem anuncios disponiveis.</p>
          )}
        </div>

        {showModal && selected && (
          <NovaCandidatura
            anuncio={selected}
            onClose={() => setShowModal(false)}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Voluntariado;