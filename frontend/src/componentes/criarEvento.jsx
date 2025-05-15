import React, { useState, useEffect } from "react";
import "../styles/PopUp.css";
import "../styles/criarEvento.css";

const CriarEvento = ({ setShowModal }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nomeEvento: "",
    dataEvento: "",
    localEvento: "",
    descricaoEvento: "",
    idCategoria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomeEvento, dataEvento, localEvento, descricaoEvento, idCategoria } = formData;
    const idAdministrador = "1" ;// Pegue o id do admin
    const foto ="Teste";

    const payload = new FormData();
    payload.append("titulo", nomeEvento);
    payload.append("data_evento", dataEvento);
    payload.append("localizacao", localEvento);
    payload.append("descricao", descricaoEvento); 
    payload.append("id_categoria", Number(idCategoria));
    payload.append("id_administrador", Number(idAdministrador)); // Importante enviar esse campo
    payload.append("fotografia", foto);
   

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/eventos/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro do servidor:", errorData);
        throw new Error(errorData.error || "Erro ao criar evento.");
      }

      const data = await res.json();
      console.log("Resposta do servidor:", data);

      alert("Evento criado com sucesso!");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      alert(err.message || "Erro ao enviar evento.");
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/categoria-evento/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar categorias");

        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        alert("Erro ao carregar categorias.");
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="overlay">
      <div className="modal">
        <h1>Criar Evento</h1>
        <form className="formulario" onSubmit={handleSubmit}>
          <input
            placeholder="Nome do Evento"
            type="text"
            name="nomeEvento"
            value={formData.nomeEvento}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Data do Evento"
            type="date"
            name="dataEvento"
            value={formData.dataEvento}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Local do Evento"
            type="text"
            name="localEvento"
            value={formData.localEvento}
            onChange={handleChange}
            required
          />

          <select
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Descrição do Evento"
            name="descricaoEvento"
            value={formData.descricaoEvento}
            onChange={handleChange}
          ></textarea>

          <input
            type="file"
            name="foto"
            onChange={handleFileChange}
            accept="image/*"
          />

          {formData.foto && (
            <div>
              <h3>Prévia da Foto:</h3>
              <img
                src={URL.createObjectURL(formData.foto)}
                alt="Prévia da foto"
                width="300"
                height="180"
              />
            </div>
          )}

          <button type="submit">Criar Evento</button>
        </form>
        <button className="close-btn" onClick={() => setShowModal(false)}>
          x
        </button>
      </div>
    </div>
  );
};

export default CriarEvento;
