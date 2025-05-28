import React, { useState } from 'react';
import '../../styles/Suporte/suporte.css';
import '../../styles/Suporte/popupChat.css'; // importa o CSS do novo popup
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../componentes/Sidebar/sidebarLayout';
import { FaBell } from 'react-icons/fa';

export default function Suporte() {
  const [openIndex, setOpenIndex] = useState(null);
  const [popupAberto, setPopupAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([
    { remetente: 'admin', texto: 'Olá! Como posso ajudar?' }
  ]);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const togglePopup = () => setPopupAberto(!popupAberto);

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (mensagem.trim() === '') return;

    setConversa([...conversa, { remetente: 'utilizador', texto: mensagem }]);
    setMensagem('');
  };

  const faqData = [
    {
      category: '❓ FAQ — Perguntas Frequentes',
      questions: [
        {
          question: '📨 Não recebi notificações, o que devo fazer?',
          answer: 'Verifica se tens notificações por abrir na tua área pessoal. Se continuares sem ver nada, tenta refrescar a página ou contacta o suporte.',
        },
        {
          question: '🛠️ Quem pode criar eventos?',
          answer: 'Apenas administradores têm permissão para criar, editar ou eliminar eventos.',
        },
        {
          question: '🎟️ Como posso participar numa rifa?',
          answer: 'Acede à secção de rifas, escolhe uma ativa e segue os passos para participar. Se ganhares, serás notificado diretamente na plataforma.',
        },
        {
          question: '🧑‍🤝‍🧑 Quero ser voluntário, o que preciso de fazer?',
          answer: 'Vai à página de voluntariado, escolhe um evento disponível e submete a tua candidatura. Irás receber uma notificação com a resposta da equipa.',
        },
        {
          question: '🔒 Posso alterar os meus dados pessoais?',
          answer: 'Sim, na tua área de utilizador podes editar o nome, telefone e morada. A alteração do username ou da palavra-passe pode requerer verificação adicional.',
        },
        {
          question: '🧹 Como elimino a minha conta?',
          answer: 'Se quiseres eliminar a conta, entra em contacto com o suporte através da plataforma. Esta ação é irreversível.',
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
                  <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Novo botão com popup tipo mini WhatsApp */}
        <div className="notificacao-wrapper" onClick={togglePopup}>
          <button className="notificacao-button">
            <FaBell /> Mensagem do Suporte
            <span className="bolinha-vermelha" />
          </button>
        </div>

        {popupAberto && (
          <div className="chat-popup">
            <div className="chat-header">
              <h3>Suporte Online</h3>
              <button className="close-chat" onClick={togglePopup}>×</button>
            </div>

            <div className="chat-mensagens">
              {conversa.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-msg ${msg.remetente === 'utilizador' ? 'me' : 'them'}`}
                >
                  {msg.texto}
                </div>
              ))}
            </div>

            <form className="chat-input" onSubmit={enviarMensagem}>
              <input
                type="text"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Escreve a tua mensagem..."
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}

        <button className="support-button" onClick={() => navigate('/suporte3')}>
          💬 Falar com Suporte
        </button>
      </div>
    </SidebarLayout>
  );
}
