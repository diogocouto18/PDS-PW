import React from "react";
import '../../styles/PopUp.css';

const Artigo2 = ({ setShowArtigo2 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo2(false)}>×</button>
                <h1>Artigo nº2</h1>
                <p>
                    Acesse a aplicação e vá até "Eventos":
                    <br/><br/>
                    Explore os eventos disponíveis na sua vizinhança.
                    <br/><br/>  
                    <b>Escolha o evento de interesse:</b> Clique no evento que deseja participar.
                    <br/><br/>
                    Clique em “Candidatar-se” ou “Participar”:
                    <br/><br/>
                    Se o evento exigir aprovação, sua candidatura será enviada ao organizador.
                    <br/><br/>
                    Caso não exija, você será confirmado automaticamente.
                    <br/><br/> 
                    Acompanhe o status: Você pode ver o status da sua candidatura no menu "Minhas Candidaturas".
                    <br/><br/>
                    <b>Nota:</b> Alguns eventos têm vagas limitadas, então candidate-se o quanto antes!
                </p>
            </div>
        </div>
        )
    }

export default Artigo2;