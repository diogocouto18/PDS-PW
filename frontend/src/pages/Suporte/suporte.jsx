import React, { useState } from "react";
import { Link } from 'react-router-dom';
import SidebarLayout from "../../componentes/Sidebar/sidebarLayout";
import Artigo1 from "../../componentes/Suporte/artigo1";
import Artigo2 from "../../componentes/Suporte/artigo2";
import Artigo3 from "../../componentes/Suporte/artigo3";
import "../../styles/Suporte/suporte.css"
import { FaMessage } from "react-icons/fa6";

const Suporte = () => {
    const [showArtigo1, setShowArtigo1] = useState(false);
    const [showArtigo2, setShowArtigo2] = useState(false);
    const [showArtigo3, setShowArtigo3] = useState(false);
    return(
        <SidebarLayout>
        <div>
            <div className="Topbar">
                <img src="/public/imagens/Logo_Branco.png"/>
                <label className="Topbar-tittle">Centro de Apoio</label>
            </div>
            <div className="artigos-container">
                <h1 className="support-title">Artigos de Suporte</h1>
                <div className="article-list">
                    <button className="article-card" onClick={() => setShowArtigo1(true)} >Artigo nº1</button>
                    <button className="article-card" onClick={() => setShowArtigo2(true)}>Artigo nº2</button>
                    <button className="article-card" onClick={() => setShowArtigo3(true)}>Artigo nº3</button>

                    {showArtigo1 && (<Artigo1 setShowArtigo1={setShowArtigo1} />)}
                    {showArtigo2 && (<Artigo2 setShowArtigo2={setShowArtigo2} />)}
                    {showArtigo3 && (<Artigo3 setShowArtigo3={setShowArtigo3} />)}
                    <Link to="/suporte3"> 
                        <button className="criar-ticket" >
                            <FaMessage/>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </SidebarLayout>
    )
}
export default Suporte;