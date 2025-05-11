import React from "react";
//import '../styles/CriarEvento.css';

const Artigo1 = ({ setShowArtigo1 }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <button className="close-btn" onClick={() => setShowArtigo1(false)}>×</button>
                <h1>Artigo nº1</h1>
                <p>
                    Acesse sua conta: Faça login na aplicação com seu e-mail e senha.
                    <br/><br/>
                    Vá até "Criar Evento": No menu principal, clique em "Criar Evento".
                    <br/><br/>
                    Preencha os detalhes do evento:
                    <br/><br/>
                    <b>Título:</b> Ex: “Churrasco de Domingo”
                    <br/><br/>
                    <b>Descrição:</b> Dê todos os detalhes que os vizinhos precisam saber.
                    <br/><br/>
                    <b>Data e Hora</b>
                    <br/><br/>
                    <b>Local:</b> Pode ser sua casa, um parque, etc.
                    <br/><br/>                
                    Clique em "<u>Criar</u>": Seu evento estará visível para a Eventos!
                    <br/><br/>
                    <b>Dica:</b> Use uma imagem para deixar seu evento mais atrativo.
                </p>
            </div>
        </div>
        )
    }

export default Artigo1;