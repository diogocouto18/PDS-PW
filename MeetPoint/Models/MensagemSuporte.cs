using System;

namespace ObjetosNegocio
{
    /// <summary>
    /// Classe que representa uma Mensagem de Suporte
    /// </summary>
    public class MensagemSuporte
    {
        #region Atributos
        private int idMensagem;
        private int idTicket;
        private int idUtilizador;
        private string conteudo;
        private DateTime dataEnvio;
        #endregion

        #region Construtores
        public MensagemSuporte()
        {
            idMensagem = 0;
            idTicket = 0;
            idUtilizador = 0;
            conteudo = "";
            dataEnvio = DateTime.Now;
        }

        public MensagemSuporte(int idMensagem, int idTicket, int idUtilizador, string conteudo, DateTime dataEnvio)
        {
            this.idMensagem = idMensagem;
            this.idTicket = idTicket;
            this.idUtilizador = idUtilizador;
            this.conteudo = conteudo;
            this.dataEnvio = dataEnvio;
        }
        #endregion

        #region Propriedades
        public int IdMensagem 
        { 
            get => idMensagem; 
            set => idMensagem = value; 
        }
        public int IdTicket 
        { 
            get => idTicket; 
            set => idTicket = value; 
        }
        public int IdUtilizador 
        { 
            get => idUtilizador; 
            set => idUtilizador = value; 
        }
        public string Conteudo 
        { 
            get => conteudo; 
            set => conteudo = value; 
        }
        public DateTime DataEnvio 
        { 
            get => dataEnvio; 
            set => dataEnvio = value; 
        }
        #endregion
    }
}
