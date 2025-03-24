import React from "react";
import arrowLeftSolid1 from "./arrow-left-solid-1.svg";
import arrowLeftSolid2 from "./arrow-left-solid-2.svg";
import barsSolid2 from "./bars-solid-2.svg";
import calendarSolid2 from "./calendar-solid-2.svg";
import clipboardSolid2 from "./clipboard-solid-2.svg";
import headsetSolid2 from "./headset-solid-2.svg";
import image4 from "./image-4.png";
import image1 from "./image.png";
import image from "./image.svg";
import logoMeetpointBranco1 from "./logo-meetpoint-branco-1.png";
import novoProjeto11 from "./novo-projeto-1-1.png";
import "./style.css";
import userSolid2 from "./user-solid-2.svg";
import vector from "./vector.svg";

export const MenuClaroE = () => {
  return (
    <div className="menu-claro-e">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <img
              className="calendar-solid"
              alt="Calendar solid"
              src={calendarSolid2}
            />

            <div className="text-wrapper">Eventos</div>
          </div>
<div className="overlap-2">
            <div className="text-wrapper-2">Suporte</div>

            <img
              className="headset-solid"
              alt="Headset solid"
              src={headsetSolid2}
            />
          </div>

          <div className="overlap-3">
            <div className="text-wrapper-3">Admin</div>

            <img className="user-solid" alt="User solid" src={userSolid2} />
          </div>

          <div className="overlap-4">
            <div className="text-wrapper-4">Menu</div>

            <img className="bars-solid" alt="Bars solid" src={barsSolid2} />
          </div>

          <div className="overlap-5">
            <div className="text-wrapper-5">Voluntariado</div>

            <img
              className="clipboard-solid"
              alt="Clipboard solid"
              src={clipboardSolid2}
            />
          </div>

          <div className="overlap-6">
            <div className="text-wrapper-6">Doar</div>

            <img className="vector" alt="Vector" src={vector} />
          </div>

          <img
            className="arrow-left-solid"
            alt="Arrow left solid"
            src={arrowLeftSolid2}
          />

          <img
            className="logo-meetpoint"
            alt="Logo meetpoint"
            src={logoMeetpointBranco1}
          />

          <img className="img" alt="Vector" src={image} />
        </div>

        <img
          className="arrow-left-solid-2"
          alt="Arrow left solid"
          src={arrowLeftSolid1}
        />

        <div className="overlap-group-2">
          <div className="rectangle" />

          <img className="image" alt="Image" src={image4} />

          <img className="image-2" alt="Image" src={image1} />

          <p className="p">. . . . . .</p>
        </div>

        <img className="novo-projeto" alt="Novo projeto" src={novoProjeto11} />
      </div>
    </div>
  );
};