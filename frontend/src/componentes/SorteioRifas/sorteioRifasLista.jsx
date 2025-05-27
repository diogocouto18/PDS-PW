import React, { useState, useEffect } from "react";
import "../../styles/SorteioRifas/sorteioRifasLista.css"; // Cria este ficheiro para o CSS

const SorteiosRifasCartaz = ({ show, onClose }) => {
  const [sorteios, setSorteios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagens, setMensagens] = useState({});

  useEffect(() => {
    if (!show) return;

    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/sorteio-rifas", {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setSorteios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [show]);

  const sortear = (id, tipo) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/sorteio-rifas/${id}/sortear/${tipo}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setMensagens(prev => ({
          ...prev,
          [id]: { ...prev[id], [tipo]: `✅ ${data.nome || "Sorteado com sucesso!"}` },
        }));
      })
      .catch(err => {
        setMensagens(prev => ({
          ...prev,
          [id]: { ...prev[id], [tipo]: `❌ Erro ao sortear: ${err.message}` },
        }));
      });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Sorteios Disponíveis</h2>
        {loading ? (
          <p>A carregar sorteios...</p>
        ) : (
          sorteios.map(s => (
            <div key={s.id} className="sorteio-card">
              <h4>{s.nome}</h4>
              <button onClick={() => sortear(s.id, "vencedor")}>Sortear 1º Lugar</button>
              <button onClick={() => sortear(s.id, "segundo")}>Sortear 2º Lugar</button>
              <button onClick={() => sortear(s.id, "terceiro")}>Sortear 3º Lugar</button>
              <div className="resultado">
                {mensagens[s.id]?.vencedor && <p>{mensagens[s.id].vencedor}</p>}
                {mensagens[s.id]?.segundo && <p>{mensagens[s.id].segundo}</p>}
                {mensagens[s.id]?.terceiro && <p>{mensagens[s.id].terceiro}</p>}
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SorteiosRifasCartaz;
