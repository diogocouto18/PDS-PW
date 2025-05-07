import React from "react";
import '../styles/CriarEvento.css';

const Artigo3= ({ setShowArtigo3 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo3(false)}>×</button>
                <h1>Artigo nº3</h1>
            </div>
        </div>
        )
    }

export default Artigo3 ;