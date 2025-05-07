import React from "react";
import '../styles/CriarEvento.css';

const CriarEvento = ({ setShowModal }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                <input type="text" placeholder="Nome da Festa" />
                <input type="text" placeholder="Localizacao" />
                <label htmlFor="file-upload" className="custom-file-upload">
                    Escolher Imagem
                    <input type="file" id="file-upload" className="file-input" />
                </label>
                <input type="text" placeholder="Data : DD/MM/YYYY" />
                <textarea placeholder="Detalhes do Evento e das Rifas" className="description"></textarea>
                <button className="create-btn">Criar</button>
            </div>
        </div>
    );
};

export default CriarEvento;
