import React , { useState } from 'react';
import '../styles/filters.css';
import { FaChevronDown, FaStar } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';

const Filter = () => {

    const [rating, setRating] = useState(0);
    const [categoryOpen, setCategoryOpen] = useState(true);
    const [ratingOpen, setRatingOpen] = useState(true);

 return (
    <div className="filter-container">
      <h2>Filtrar</h2>
      <hr />

      {/* Categoria */}
      <div className="filter-section">
        <div
          className="section-header"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span>Categoria</span>
          <FaChevronDown className={categoryOpen ? 'open' : ''} />
        </div>

        {categoryOpen && (
          <div className="checkboxes">
            {[...Array(6)].map((_, index) => (
              <label key={index}>
                <input type="checkbox" /> Categoria
              </label>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Avaliação */}
      <div className="filter-section">
        <div
          className="section-header"
          onClick={() => setRatingOpen(!ratingOpen)}
        >
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
                  <FaStar
                    className={`star-icon ${
                      starValue <= rating ? 'active' : ''
                    }`}
                  />
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