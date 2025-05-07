// LoginPage.jsx
import React, { useState } from 'react';
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isAdministrador, setIsAdmin] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isAdministrador
      ? 'http://localhost:3000/auth/login-administrador'
      : 'http://localhost:3000/auth/login-utilizador';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Login efetuado com sucesso!');
        setMensagemTipo('sucesso');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        setTimeout(() => {
          console.log("Role após login:", data.role);
          window.location.href =
            data.role === 'Administrador' ? '/menuAdministrador' : '/menu';
        }, 1500);
      } else {
        setMensagem(data.error || 'Falha no login.');
        setMensagemTipo('erro');
      }
    } catch (err) {
      setMensagem('Erro ao conectar ao servidor.');
      setMensagemTipo('erro');
    }
  };

  return (
    <div className="fundo">
      <div className="login-page">
        <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo" />

        <div className="form-wrapper-login">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Palavra-passe" value={formData.password} onChange={handleChange} required />

            <div className="options">
              <label>
                <input type="checkbox" checked={isAdministrador} onChange={handleRoleChange} />
                Login como Administrador
              </label>
            </div>
            
            {mensagem && (
              <p className={`mensagem ${mensagemTipo === 'erro' ? 'erro' : 'sucesso'}`}>
                {mensagem}
              </p>
          )}
            <button type="submit">Entrar</button>
          </form>



          <p className="register">
            Ainda não tem conta? <a href="/registo">Registe-se aqui</a>
          </p>

          

        </div>
      </div>
    </div>
  );
}

export default Login;