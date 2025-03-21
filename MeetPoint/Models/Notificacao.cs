using System;

namespace ObjetosNegocio
{
    /// <summary>
    /// Classe que representa uma Notificação
    /// </summary>
    public class Notificacao
    {
        #region Atributos
        private int idNotificacao;
        private int idAdmin;
        private string tipo;
        private string conteudo;
        private string estado;
        private DateTime dataEnvio;
        #endregion

        #region Construtores
        public Notificacao()
        {
            idNotificacao = 0;
            idAdmin = 0;
            tipo = "";
            conteudo = "";
            estado = "Não Lido";
            dataEnvio = DateTime.Now;
        }

        public Notificacao(int idNotificacao, int idAdmin, string tipo, string conteudo, string estado, DateTime dataEnvio)
        {
            this.idNotificacao = idNotificacao;
            this.idAdmin = idAdmin;
            this.tipo = tipo;
            this.conteudo = conteudo;
            this.estado = estado;
            this.dataEnvio = dataEnvio;
        }
        #endregion

        #region Propriedades
        public int IdNotificacao 
        { 
            get => idNotificacao; 
            set => idNotificacao = value; 
        }
        public int IdAdmin 
        { 
            get => idAdmin; 
            set => idAdmin = value; 
        }
        public string Tipo 
        { 
            get => tipo; 
            set => tipo = value; 
        }
        public string Conteudo 
        { 
            get => conteudo; 
            set => conteudo = value; 
        }
        public string Estado 
        { 
            get => estado; 
            set => estado = value; 
        }
        public DateTime DataEnvio 
        { 
            get => dataEnvio; 
            set => dataEnvio = value; 
        }
        #endregion
    }
}
