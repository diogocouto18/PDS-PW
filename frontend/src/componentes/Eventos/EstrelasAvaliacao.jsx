import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const EstrelasAvaliacao = ({ idEvento }) => {
  const [avaliacao, setAvaliacao] = useState(0);
  const [avaliacaoExistente, setAvaliacaoExistente] = useState(null);
  const [media, setMedia] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const resAvaliacoes = await fetch(
          `http://localhost:3000/avaliacoesEvento/evento/${idEvento}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resMedia = await fetch(
          `http://localhost:3000/avaliacoesEvento/evento/${idEvento}/media`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resAvaliacoes.ok) {
          const avaliacoes = await resAvaliacoes.json();
          const minha = avaliacoes.find(
            (av) => av.id_utilizador === parseInt(localStorage.getItem("id"))
          );
          if (minha) {
            setAvaliacao(minha.nota);
            setAvaliacaoExistente(minha.id);
          }
        }

        if (resMedia.ok) {
          const { media } = await resMedia.json();
          setMedia(media?.toFixed(1));
        }
      } catch (err) {
        console.error("Erro ao buscar avaliação:", err);
      }
    };

    fetchDados();
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
        const result = await res.json();
        setAvaliacao(nota);
        if (result.media) setMedia(result.media.toFixed(1));
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
      style={{ textAlign: "left" }}
    >
      <div style={{ display: "flex", gap: "5px", marginBottom: "4px" }}>
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
      {media !== null && (
        <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "2px" }}>
          Média: {media} ⭐
        </div>
      )}
    </div>
  );
};

export default EstrelasAvaliacao;