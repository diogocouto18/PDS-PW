import React, {useState} from "react";
import  "../styles/PopUp.css";
import "../styles/criarEvento.css";


const CriarEvento = ({ setShowModal }) => {

  return (
    <div className="overlay">
      <div className="modal">
        <h1>Criar Evento</h1>
        <form className="formulario">
          
            
            <input placeholder="Nome do Evento" type="text" name="nomeEvento" required />
        
            <input placeholder="Data do Evento" type="date" name="dataEvento" required />
        
            <input placeholder=" Local do Evento" type="text" name="localEvento" required />
        
            <textarea placeholder="Descrição do Evento" name="descricaoEvento" required></textarea>
          
          <button type="submit">Criar Evento</button>
        </form>
        <button className="close-btn" onClick={()=>setShowModal (false)}>
          x
        </button>
      </div>
    </div>
  );
}

export default CriarEvento;