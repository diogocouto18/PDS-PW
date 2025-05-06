import React, {useState} from "react";
import '../styles/eventos.css';
import Sidebar from "../componentes/sidebar";
import SearchBar from "../componentes/searchbar"
import Filter from "../componentes/filters";

const Eventos =() => {

    return (
        <div>
            <Sidebar/>
            <div className="search-container">
                <SearchBar />
            </div>
            <div className="eventos-container">
                <div className="Evento"></div>
                <div>
                    <Filter />
                </div>
            </div>
            
        </div>
    );
};

export default Eventos;