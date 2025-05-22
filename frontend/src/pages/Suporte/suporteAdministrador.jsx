import React, { useState, useEffect } from 'react';
import '../../styles/Suporte/suporteAdministrador.css';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';

const SuporteAdministrador = () => {
    
    return(
        <SidebarLayout>
            <div className='admin-suporte-page'>
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
        </SidebarLayout>
    );
};
export default SuporteAdministrador;