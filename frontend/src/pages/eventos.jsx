import React, { useState } from "react";
import '../styles/eventos.css';
import Sidebar from "../componentes/Sidebar";
import SearchBar from "../componentes/searchbar";
import Filter from "../componentes/filters";
import CriarEvento from '../componentes/criar_evento';

const Eventos = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Sidebar />
            <div className="search-container">
                <SearchBar />
            </div>
            <div className="eventos-container">
                <div className="Evento"></div>
                <div>
                    <Filter />
                </div>
                <button className="criar-evento-btn" onClick={() => setShowModal(true)}>
                    +
                </button>

                {/* Passando o setShowModal como uma prop para o CriarEvento */}
                {showModal && (<CriarEvento setShowModal={setShowModal} />)}
            </div>
        </div>
    );
};

export default Eventos;