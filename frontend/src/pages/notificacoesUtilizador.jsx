import React, { useEffect, useState } from "react";
import styles from "../styles/notificacoesUtilizador.css";

function NotificacoesUtilizador() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [erro, setErro] = useState(null);

  // Substitui por ID real do utilizador autenticado
  const id_utilizador = localStorage.getItem("id_utilizador");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id_utilizador || !token) {
      setErro("Utilizador não autenticado.");
      return;
    }

    fetch(`http://localhost:3000/notificacoes/utilizador/${id_utilizador}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao procurar notificações");
        return res.json();
      })
      .then((data) => setNotificacoes(data))
      .catch((err) => setErro(err.message));
  }, []);

  return (
    <div className={styles.container}>
      <h2>📧 Notificações</h2>
      {erro && <p className={styles.erro}>{erro}</p>}
      {notificacoes.length === 0 && !erro ? (
        <p>Não tens notificações.</p>
      ) : (
        <ul className={styles.lista}>
          {notificacoes.map((notificacao) => (
            <li key={notificacao.id} className={styles.notificacao}>
              <h4>{notificacao.titulo}</h4>
              <p>{notificacao.mensagem}</p>
              <span className={notificacao.estado === "aberta" ? styles.aberta : styles.fechada}>
                {notificacao.estado}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificacoesUtilizador;
