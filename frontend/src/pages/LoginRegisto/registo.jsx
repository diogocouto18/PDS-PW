import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import '../../styles/LoginRegisto/registo.css';

function Registo() {
  const [formData, setFormData] = useState({
    passphrase: '',
    nome: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    telemovel: '',
    morada: '',
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setMensagem('Tem de aceitar os termos e condições.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMensagem('As palavras-passe não coincidem.');
      return;
    }

    const isAdministrador = !!formData.passphrase;
    const endpoint = isAdministrador
      ? 'http://localhost:3000/auth/register-administrador'
      : 'http://localhost:3000/auth/register-utilizador';

    const payload = isAdministrador
      ? {
        nome: formData.nome,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        passphrase: formData.passphrase,
      }
      : {
        nome: formData.nome,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        telefone: formData.telemovel,
        morada: formData.morada,
      };

    console.log("Payload enviado:", payload);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem('Registo efetuado com sucesso!');

        setTimeout(() => {
          window.location.href = '/';
        }, 2500);

      } else {
        alert(data.error);
      }
    } catch (err) {
      setMensagem('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className='fundo'>
      <div className="register-page">
        <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo" />
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <h2 className='title-register'>Registar</h2>
            <div className="input-group">
              <input type="text" name="passphrase" placeholder="Frase-passe (Administradores)" onChange={handleChange} value={formData.passphrase} />
              <input type="text" name="nome" placeholder="Nome *" onChange={handleChange} required />
              <input type="text" name="username" placeholder="Nome de Utilizador *" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email *" onChange={handleChange} required />
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Palavra Passe *" onChange={handleChange} required />
                <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                  <img className='eyeIco' src='./imagens/eyeIco.png' alt="Mostrar Palavra Passe" />
                </span>
              </div>
              <input type="password" name="confirmPassword" placeholder="Confirmar Palavra Passe *" onChange={handleChange} required />
              <input type="text" name="telemovel" placeholder="Telemóvel *" onChange={handleChange} disabled={!!formData.passphrase} className={formData.passphrase ? 'campo-desativado' : ''} />
              <input type="text" name="morada" placeholder="Morada (Opcional)" onChange={handleChange} disabled={!!formData.passphrase} className={formData.passphrase ? 'campo-desativado' : ''} />
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
              <label htmlFor="terms">
                Li e aceito os{' '}
                <a href="/termos.pdf" target="_blank" rel="noopener noreferrer">
                  termos e condições
                </a>
              </label>
            </div>

            <button type="submit" className="register-btn">
              Registar
            </button>

            <p className="login-link">
              Já possui uma conta? <Link to="/">Iniciar sessão</Link>
            </p>

            {mensagem && (
              <p style={{ marginTop: '10px', color: mensagem.startsWith('Erro') ? 'red' : 'green' }}>
                {mensagem}
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Registo;


