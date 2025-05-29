import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const EstrelasAvaliacao = ({ idEvento }) => {
  const [avaliacao, setAvaliacao] = useState(0);
  const [avaliacaoExistente, setAvaliacaoExistente] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const res = await fetch(`http://localhost:3000/avaliacoesEvento/evento/${idEvento}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const minha = data.find(av => av.id_utilizador === parseInt(localStorage.getItem("id")));
          if (minha) {
            setAvaliacao(minha.nota);
            setAvaliacaoExistente(minha.id);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar avaliação:", err);
      }
    };

    fetchAvaliacao();
  }, [idEvento]);

  const handleClick = async (nota) => {
    try {
      const url = avaliacaoExistente
        ? `http://localhost:3000/avaliacoesEvento/${avaliacaoExistente}`
        : `http://localhost:3000/avaliacoesEvento`;

      const method = avaliacaoExistente ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_evento: idEvento,
          nota,
        }),
      });

      if (res.ok) {
        setAvaliacao(nota);
      }
    } catch (err) {
      console.error("Erro ao avaliar:", err);
    }
  };

  return (
    <div
      className="estrelas-interativas"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {[1, 2, 3, 4, 5].map((estrela) => (
        <FaStar
          key={estrela}
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(estrela);
          }}
          color={estrela <= avaliacao ? "#FFD700" : "#ccc"}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
};

export default EstrelasAvaliacao;