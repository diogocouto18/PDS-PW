import React, { useState } from 'react';
import '../styles/searchbar.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const SearchBar = ({ onSearch }) => {
  const [termo, setTermo] = useState('');

  const handleChange = (e) => {
    const valor = e.target.value;
    setTermo(valor);
    if (onSearch) {
      onSearch(valor);
    }
  };

  return (
    <div className='pesquisa-container'>
      <form className='form-pesquisa' onSubmit={e => e.preventDefault()}>
        <span className="icon"><FaMagnifyingGlass /></span>
        <input
          className='barra-pesquisa'
          type='text'
          placeholder='Pesquisa'
          value={termo}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default SearchBar;
