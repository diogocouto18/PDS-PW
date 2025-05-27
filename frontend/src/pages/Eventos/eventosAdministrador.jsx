import React, { useState } from "react";
import '../../styles/Eventos/eventosAdministrador.css';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import SearchBar from "../../componentes/searchbar";
import Filter from "../../componentes/filters";
import CriarEvento from '../../componentes/Eventos/criarEvento';
import Eventos from './eventos.jsx';

const EventosAdministrador = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Eventos/>;            
                <button className="criar-evento-btn" onClick={() => setShowModal(true)}>
                    +
                </button>         
            {showModal && (<CriarEvento setShowModal={setShowModal} />)}
        </div>
    );
};

export default EventosAdministrador;