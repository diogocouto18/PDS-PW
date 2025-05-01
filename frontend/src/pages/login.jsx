// LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/login.css';

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('token', data.token);
          // Redirecionar para dashboard ou página principal
          window.location.href = '/menu';
        } else {
          setError(data.error || 'Falha no login');
        }
      } catch (err) {
        setError('Erro ao conectar ao servidor.');
      }
    };
  
  return (
    <div className='fundo'>
    <div className="login-page">
      <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo" />

      <div className="form-wrapper-login">
        <h2 className="title">Iniciar sessão</h2>
        <form onSubmit={handleLogin}>
        <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />

          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Palavra Passe" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
              <img className='eyeIco'src='./imagens/eyeIco.png'></img>
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
          <p className="register">
            É a primeira vez que usa a MeetPoint?{' '}
            <Link to="/registo">Registar</Link>            
          </p>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
