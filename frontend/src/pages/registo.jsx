import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from './login';

import '../styles/registo.css';

function Registo() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='fundo'>
    <div className="register-page">
      <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo" />

      <div className="form-wrapper">
        <form>
          <h2 className='title-register'>Registar</h2>
          <div className="input-group">
            <input type="text" placeholder="Nome de Utilizador *" required />
            <input type="email" placeholder="Email *" required />
            <input type="text" placeholder="Telemovel" />
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} placeholder="Palavra Passe" required/>
                    <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                      <img className='eyeIco'src='./imagens/eyeIco.png'></img>
                    </span>
              </div>
            <input type="password" placeholder="Confirmar Palavra Passe" required/>
            <input type="text" placeholder="Morada (Opcional)" />
            <input type="text" placeholder="Nome Completo" required />
          </div>

          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label htmlFor="terms"> Li e aceito os termos e condições</label>
          </div>

          <button type="submit" className="register-btn">
            Registar
          </button>

          <p className="login-link">
            Já possui uma conta? <Link to="/">Iniciar sessão</Link>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Registo;
