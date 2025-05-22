import React, { useState } from "react";
import '../../styles/Eventos/eventosAdministrador.css';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import SearchBar from "../../componentes/searchbar";
import Filter from "../../componentes/filters";
import CriarEvento from '../../componentes/Eventos/criarEvento';

const EventosAdministrador = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <SidebarLayout >
            <div>
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
        </SidebarLayout>
    );
};

export default EventosAdministrador;