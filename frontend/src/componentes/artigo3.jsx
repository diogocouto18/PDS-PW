import React from "react";
import '../styles/CriarEvento.css';

const Artigo3= ({ setShowArtigo3 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo3(false)}>×</button>
                <h1>Artigo nº3</h1>
                <p>
                    Acesse sua conta e vá em “Meus Eventos”.
                    <br/><br/>
                    Clique no evento desejado.
                    <br/><br/>
                    Vá até a aba “Candidaturas”: Aqui você verá a lista de vizinhos que se candidataram.
                    <br/><br/>
                    Aprovar ou Rejeitar:
                    <br/><br/>
                    Clique em “Aprovar” para confirmar a presença do vizinho.
                    <br/><br/>
                    Clique em “Rejeitar” caso não possa aceitá-lo no evento.
                    <br/><br/>
                    <b>Importante:</b> A decisão será notificada ao vizinho automaticamente.
                    <br/><br/>
                    <b>Dica extra:</b> Seja gentil nas mensagens se quiser enviar um recado ao candidato!
                </p>
            </div>
        </div>
        )
    }

export default Artigo3 ;