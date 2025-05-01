import React, { useState, useEffect } from 'react';
import '../styles/searchbar.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const SearchBar = () => {

    return (
        <div className='pesquisa-container '>
            <form className='form-pesquisa'>
                <span className="icon"><FaMagnifyingGlass /></span><input className='barra-pesquisa' type='text' placeholder='Pesquisa'/>
            </form>
        </div>
    );
};
export default SearchBar;