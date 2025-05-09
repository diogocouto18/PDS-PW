import React, { useState } from 'react';
import '../styles/CriarEvento.css';

const CriarEvento = ({ setShowModal }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    localizacao: '',
    data_evento: '',
    descricao: '',
  });

  const [imagem, setImagem] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setImagemSelecionada(true);
    } else {
      setImagem(null);
      setImagemSelecionada(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { titulo, localizacao, data_evento, descricao } = formData;
    if (!titulo || !localizacao || !data_evento || !descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // Converte DD/MM/YYYY para ISO 8601
    const [dia, mes, ano] = data_evento.split('/');
    const dataISO = new Date(`${ano}-${mes}-${dia}`).toISOString();

    const payload = new FormData();
    payload.append("titulo", titulo);
    payload.append("localizacao", localizacao);
    payload.append("data_evento", dataISO);
    payload.append("descricao", descricao);
    payload.append("id_administrador", localStorage.getItem("id_administrador")); // exemplo
    payload.append("id_categoria", 1); // categoria padrão; idealmente você seleciona no form
    if (imagem) payload.append("fotografia", imagem);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/eventos/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao criar evento.");

      alert("Evento criado com sucesso!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao enviar evento.");
    }
  };

  return (
    <div className="overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <button type="button" className="close-btn" onClick={() => setShowModal(false)}>×</button>

        <input
          type="text"
          name="titulo"
          placeholder="Nome da Festa"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="localizacao"
          placeholder="Localização"
          value={formData.localizacao}
          onChange={handleChange}
          required
        />

        <label htmlFor="file-upload" className="custom-file-upload">
          {imagemSelecionada ? 'Imagem adicionada' : 'Escolher Imagem'}
          <input type="file" id="file-upload" className="file-input" onChange={handleImagemChange} />
        </label>

        <input
          type="text"
          name="data_evento"
          placeholder="Data : DD/MM/YYYY"
          value={formData.data_evento}
          onChange={handleChange}
          required
        />

        <textarea
          name="descricao"
          placeholder="Detalhes do Evento e das Rifas"
          className="description"
          value={formData.descricao}
          onChange={handleChange}
          required
        />

        <button type="submit" className="create-btn">Criar</button>
      </form>
    </div>
  );
};

export default CriarEvento;