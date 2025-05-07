import React from "react";
import '../styles/CriarEvento.css';

const Artigo2 = ({ setShowArtigo2 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo2(false)}>×</button>
                <h1>Artigo nº2</h1>
            </div>
        </div>
        )
    }

export default Artigo2;