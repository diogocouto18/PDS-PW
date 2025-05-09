import React from 'react';
import '../styles/anunciosAdministrador.css';

const AnunciosCartaz = ({ anuncio, onEncerrar }) => {
  const { id, cargo, descricao, estado, data_publicacao, Evento } = anuncio;

  const encerrarAnuncio = async () => {
    if (estado === 'Terminado') return;

    const confirmar = window.confirm('Tens a certeza que queres encerrar este anúncio?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/anuncios/${id}/encerrar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erro ao encerrar anúncio.');
      alert('Anúncio encerrado com sucesso!');
      onEncerrar(id); 
    } catch (err) {
      console.error(err);
      alert('Erro ao encerrar o anúncio.');
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-PT');
  };

  return (
    <div className="anuncio-card">
      <h3>{cargo}</h3>
      <p><strong>Descrição:</strong> {descricao}</p>
      <p><strong>Evento:</strong> {Evento?.titulo || 'Sem nome'}</p>
      <p><strong>Data de Publicação:</strong> {formatarData(data_publicacao)}</p>
      <p><strong>Estado:</strong> {estado}</p>

      {estado === 'Ativo' && (
        <button className="encerrar-btn" onClick={encerrarAnuncio}>
          Encerrar
        </button>
      )}
    </div>
  );
};

export default AnunciosCartaz;