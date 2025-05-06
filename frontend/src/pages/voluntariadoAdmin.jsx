import React, { useState } from 'react';
import NovoAnuncio from '../componentes/novoAnuncio';
import Sidebar from "../componentes/sidebar";
import '../styles/voluntariadoAdmin.css';

const AnunciosAdmin = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="voluntariado-page">
        <Sidebar/>
        <h2>Candidaturas Recebidas</h2>
        <div className="candidaturas-grid">
            {/* Aqui colocas os cards das candidaturas */}
        </div>

        <h2>Anúncios</h2>
        <div className="anuncios-grid">
            <div className="anuncio-plus" onClick={() => setShowModal(true)}>
            +
            </div>
        </div>

        {showModal && <NovoAnuncio onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AnunciosAdmin;