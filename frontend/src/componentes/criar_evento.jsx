import React, { useState } from 'react';
import '../styles/CriarEvento.css';

  const CriarEvento = ({ setShowModal }) => {
  const [formData, setFormData] = useState({
    nome: '',
    localizacao: '',
    data: '',
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

    const { nome, localizacao, data, descricao } = formData;
    if (!nome || !localizacao || !data || !descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = new FormData();
    payload.append("nome", nome);
    payload.append("localizacao", localizacao);
    payload.append("data", data);
    payload.append("descricao", descricao);
    if (imagem) payload.append("imagem", imagem);

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

      // Atualiza a lista de eventos local
      setEventos((prev) => [...prev, data]);

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
          name="nome"
          placeholder="Nome da Festa"
          value={formData.nome}
          onChange={handleChange}
        />

        <input
          type="text"
          name="localizacao"
          placeholder="Localizacao"
          value={formData.localizacao}
          onChange={handleChange}
        />

        <label htmlFor="file-upload" className="custom-file-upload">
          {imagemSelecionada ? 'Imagem adicionada' : 'Escolher Imagem'}
          <input type="file" id="file-upload" className="file-input" onChange={handleImagemChange} />
        </label>

        <input
          type="text"
          name="data"
          placeholder="Data : DD/MM/YYYY"
          value={formData.data}
          onChange={handleChange}
        />

        <textarea
          name="descricao"
          placeholder="Detalhes do Evento e das Rifas"
          className="description"
          value={formData.descricao}
          onChange={handleChange}
        />

        <button type="submit" className="create-btn">Criar</button>
      </form>
    </div>
  );
};

export default CriarEvento;
