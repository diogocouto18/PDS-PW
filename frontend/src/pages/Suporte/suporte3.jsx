import React from "react";
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import "../../styles/Suporte/suporte3.css";
function Suporte3() {
    return ( 
        <SidebarLayout>
            <div className="Suporte3-page">
                <div className="Topbar">
                    <img src="/public/imagens/Logo_Branco.png"/>
                    <label className="Topbar-tittle">Centro de Apoio</label>
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
            </div>
        </SidebarLayout> ) }
export default Suporte3;