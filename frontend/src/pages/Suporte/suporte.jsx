import React, { useState } from 'react';
import '../../styles/Suporte/suporte.css';

import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';
import { FaBell } from 'react-icons/fa';
import ChatPopup from './popupChat';

export default function Suporte() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: '❓ FAQ — Perguntas Frequentes',
      questions: [
        {
          question: '📨 Não recebi notificações, o que devo fazer?',
          answer:
            'Verifica se tens notificações por abrir na tua área pessoal. Se continuares sem ver nada, tenta refrescar a página ou contacta o suporte.',
        },
        {
          question: '🛠️ Quem pode criar eventos?',
          answer:
            'Apenas administradores têm permissão para criar, editar ou eliminar eventos.',
        },
        {
          question: '🎟️ Como posso participar numa rifa?',
          answer:
            'Acede à secção de rifas, escolhe uma ativa e segue os passos para participar. Se ganhares, serás notificado diretamente na plataforma.',
        },
        {
          question: '🧑‍🤝‍🧑 Quero ser voluntário, o que preciso de fazer?',
          answer:
            'Vai à página de voluntariado, escolhe um evento disponível e submete a tua candidatura. Irás receber uma notificação com a resposta da equipa.',
        },
        {
          question: '🔒 Posso alterar os meus dados pessoais?',
          answer:
            'Sim, na tua área de utilizador podes editar o nome, telefone e morada. A alteração do username ou da palavra-passe pode requerer verificação adicional.',
        },
        {
          question: '🧹 Como elimino a minha conta?',
          answer:
            'Se quiseres eliminar a conta, entra em contacto com o suporte através da plataforma. Esta ação é irreversível.',
        },
      ],
    },
  ];

  return (
    <SidebarLayout>
      <div className="faq-container">
        <h1>Centro de Apoio</h1>
        <div className="faq-content">
          {faqData.map((category, i) => (
            <div key={i} className="faq-category">
              <h2>{category.category}</h2>
              {category.questions.map((item, index) => (
                <div key={index} className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() => toggleQuestion(index)}
                  >
                    {item.question}
                    <span>{openIndex === index ? '−' : '+'}</span>
                  </div>
                  <div
                    className={`faq-answer ${
                      openIndex === index ? 'open' : ''
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Chat de suporte com popup separado */}
        <ChatPopup />

        <button
          className="support-button"
          onClick={() => navigate('/suporte3')}
        >
          💬 Falar com Suporte
        </button>
      </div>
    </SidebarLayout>
  );
}
