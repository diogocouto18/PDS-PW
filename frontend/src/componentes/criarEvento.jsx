import React, {useState} from "react";
import  "../styles/PopUp.css";
import "../styles/criarEvento.css";


const CriarEvento = ({ setShowModal }) => {
 const [formData, setFormData] = useState({
    nomeEvento: "",
    dataEvento: "",
    localEvento: "",
    descricaoEvento: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomeEvento, dataEvento, localEvento, descricaoEvento } = formData;

    if (!nomeEvento || !dataEvento || !localEvento || !descricaoEvento) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      titulo: nomeEvento,
      data_evento: dataEvento, 
      localizacao: localEvento,
      descricao: descricaoEvento
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/eventos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
      <div className="modal">
        <h1>Criar Evento</h1>
        <form className="formulario">
          
            <input placeholder="Nome do Evento" type="text" name="nomeEvento" required />
        
            <input placeholder="Data do Evento" type="date" name="dataEvento" required />
        
            <input placeholder=" Local do Evento" type="text" name="localEvento" required />
        
            <textarea placeholder="Descrição do Evento" name="descricaoEvento" required></textarea>
          
          <button type="submit">Criar Evento</button>
        </form>
        <button className="close-btn" onClick={()=>setShowModal (false)}>
          x
        </button>
      </div>
    </div>
  );
}

export default CriarEvento;