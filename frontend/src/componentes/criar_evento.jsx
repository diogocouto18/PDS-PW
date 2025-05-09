import React from "react";
import '../styles/CriarEvento.css';

const CriarEvento = ({ setShowModal }) => {
    const [nome, setNome] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState(null);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("localizacao", localizacao);
        formData.append("data", data);
        formData.append("descricao", descricao);
        if (imagem) {
            formData.append("imagem", imagem);
        }

        try {
            const response = await fetch("http://localhost:3000/eventos", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("Evento criado com sucesso!");
                setShowModal(false);
            } else {
                alert("Erro ao criar o evento.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na conexão.");
        }
    };

    return (
        <div className="overlay">
            <div className="modal">
                <form onSubmit={handleSubmit} >
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                <input type="text" placeholder="Nome da Festa" />
                <input type="text" placeholder="Localizacao" />
                <label htmlFor="file-upload" className="custom-file-upload">
                    Escolher Imagem
                    <input type="file" id="file-upload" className="file-input" />
                </label>
                <input type="text" placeholder="Data : DD/MM/YYYY" />
                <textarea placeholder="Detalhes do Evento e das Rifas" className="description"></textarea>
                <button className="create-btn">Criar</button>
                </form>
            </div>
        </div>
    );
};

export default CriarEvento;