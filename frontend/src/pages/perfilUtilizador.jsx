import React from 'react';
import Sidebar from '../componentes/sidebar';
import '../styles/perfilUtilizador.css';
import { FaUser } from 'react-icons/fa';

function PerfilUtilizador() {
  return (
    <div className="perfil-page">
      <Sidebar />
      <div className="perfil-container">
        <div className="perfil-foto-info">
          <div className="foto-box">
            <div className="foto-placeholder"><span classeName="icon"><FaUser /></span></div>
          </div>
          <div className="info-box">
            <h1>Nome utilizador</h1>
            <strong>Nome Apelido</strong>
            <p>email@email.com</p>
            <p>+351931491491</p>
            <p>Rua dos Unidos 123</p>
            <p>Barcelos 4750-726</p>
            <p className="doados">Total Doado: <strong>1560€</strong></p>
          </div>
        </div>

        <div className="botoes-box">
          <button className="btn-editar">Editar Perfil</button>
          <button className="btn-terminar">Terminar Sessão</button>
        </div>

        <div className="detalhes">
          <div className="secao">
            <h3>Candidaturas Voluntariado</h3>
            <p>Colheita de uvas</p>
            <p><strong>Estado</strong>: Aceite</p>
          </div>

          <div className="secao">
            <h3>Estado rifas</h3>
            <p>Rifa do evento</p>
            <p><strong>Vencedor</strong></p>
          </div>

          <div className="secao">
            <h3>Histórico Doações</h3>
            <p>20/01 - Doação Evento Caminhada <span className="valor">15€</span></p>
            <p>22/02 - Doação Evento Desportivo da Sueca <span className="valor">70€</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUtilizador;
