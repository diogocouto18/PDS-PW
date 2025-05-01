import React, { useState, useEffect } from 'react';
import '../styles/menu.css';
import Sidebarfixed from "../componentes/Sidebar-fixed";

const images = [
    '/imagens/imagem carrosel 1.jpg',
    '/imagens/imagem carrosel 2.jpg',
    '/imagens/imagem carrosel 3.jpg'
  ];

  const Menu = () => {
    const [current, setCurrent] = useState(0);
  
    const nextSlide = () => {
      setCurrent((prev) => (prev + 1) % images.length);
    };
  
    const prevSlide = () => {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };
  
    // Autoplay a cada 3 segundos
    useEffect(() => {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); 
  
      return () => clearInterval(interval); // limpa o intervalo ao desmontar
    }, []);

    return (
    <div className="MenuPage">
    <Sidebarfixed />
      <Filter/>
    <div className="imagemTitle">
        <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo_menu" />
    </div>
    <div className="carousel-container">
    <div
    className="carousel-slider"
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Slide ${index}`}
        className="carousel-image"
      />
    ))}
  </div>
    </div>
    
    
</div>
    );
};
export default Menu;