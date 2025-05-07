import React, { useState, useEffect } from 'react';
import '../styles/suporte-admin.css';
import Sidebar from "../componentes/Sidebar";

const SuporteAdmin1 = () => {
    return(
        <div className='admin-suporte-page'>
            <Sidebar/>
            <div className='Topbar'>
                <img src='/imagens/Logo_Branco.png'/>
                <label className='Topbar-tittle'>Centro de Apoio</label>
            </div>
            <div className='container-msg'>
                <form>
                    <button className='support-msg-btn'>
                        <span className='left'>Titlo</span>
                        <span className='right'>Data de envio</span>
                    </button>
                </form>
                
                
            </div>

        </div>
    )
}
export default SuporteAdmin1;