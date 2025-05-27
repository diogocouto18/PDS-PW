import React, { useState, useEffect } from 'react';
import '../../styles/Menu/menu.css';
import SidebarFixed from "../../componentes/Sidebar/sidebarFixed";

const images = [
    '/imagens/imagem carrosel 1.jpg',
    '/imagens/imagem carrosel 3.jpg',
    '/imagens/imagem carrosel 4.jpg'
  ];

  const MenuAdministrador = () => {
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

    const role = localStorage.getItem('role');

    return (
    <div className="MenuPage">
      <SidebarFixed role={role} />
      <div className="imagemTitle">
        <img src="/imagens/Logo.png" alt="MeetPoint Logo" className="logo_menu" />
      </div>
      <div className="carousel-container">
        <div className="carousel-slider" style={{ transform: `translateX(-${current * 100}%)` }}>
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
  
export default MenuAdministrador;