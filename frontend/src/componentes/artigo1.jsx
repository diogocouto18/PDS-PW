import React from "react";
import '../styles/CriarEvento.css';

const Artigo1 = ({ setShowArtigo1 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo1(false)}>×</button>
                <h1>Artigo nº1</h1>
            </div>
        </div>
        )
    }

export default Artigo1;