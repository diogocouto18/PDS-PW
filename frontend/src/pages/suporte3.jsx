import React from "react";
import Sidebar from "../componentes/sidebar";
import "../styles/suporte3.css";
function Suporte3() {
    return ( 
        <div className="Suporte3-page">
            <Sidebar/>
        <div className="Topbar">
        <img src="../imagens/Logo_Branco.png"/>
        </div>
        <div className="outside">
        <form action="POST">
            <textarea className="suporte-message" placeholder="Mensagem De Suporte" />
            <br/>
            <button className="send-suporte"> 
                Enviar
            </button>
        </form>
        </div>

   </div> ) }

   export default Suporte3;