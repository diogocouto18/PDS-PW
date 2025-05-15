import React, { useState, useEffect } from 'react';
import '../styles/filters.css';
import { FaChevronDown, FaStar } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';

const Filter = () => {
  const [rating, setRating] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [categorias, setCategorias] = useState([]); // <-- Estado para categorias

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
        setCategorias(data); // <-- Salva categorias no estado
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        alert("Erro ao carregar categorias.");
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="filter-container">
      <h2>Filtrar</h2>
      <hr />

      {/* Categoria */}
      <div className="filter-section">
        <div className="section-header" onClick={() => setCategoryOpen(!categoryOpen)}>
          <span>Categoria</span>
          <FaChevronDown className={categoryOpen ? 'open' : ''} />
        </div>

        {categoryOpen && (
          <div className="checkboxes">
            {categorias.map((categoria) => (
              <label key={categoria.id}>
                <input type="checkbox" value={categoria.id} />
                {categoria.nome}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Avaliação */}
      <div className="filter-section">
        <div className="section-header" onClick={() => setRatingOpen(!ratingOpen)}>
          <span>Avaliação</span>
          <FaChevronDown className={ratingOpen ? 'open' : ''} />
        </div>

        {ratingOpen && (
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  className="star-button"
                  onClick={() => setRating(starValue)}
                >
                  <FaStar className={`star-icon ${starValue <= rating ? 'active' : ''}`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <hr />

      <button className="filter-button">Filtrar</button>
    </div>
  );
};

export default Filter;
