using System;

namespace ObjetosNegocio
{
    /// <summary>
    /// Classe que representa um Ticket de Suporte
    /// </summary>
    public class TicketSuporte
    {
        #region Atributos
        private int idTicket;
        private int idUtilizador;
        private string assunto;
        private string descricao;
        private string estado;
        private DateTime dataAbertura;
        private DateTime? dataFechamento;
        #endregion

        #region Construtores
        public TicketSuporte()
        {
            idTicket = 0;
            idUtilizador = 0;
            assunto = "";
            descricao = "";
            estado = "Aberto";
            dataAbertura = DateTime.Now;
            dataFechamento = null;
        }

        public TicketSuporte(int idTicket, int idUtilizador, string assunto, string descricao, string estado, DateTime dataAbertura, DateTime? dataFechamento)
        {
            this.idTicket = idTicket;
            this.idUtilizador = idUtilizador;
            this.assunto = assunto;
            this.descricao = descricao;
            this.estado = estado;
            this.dataAbertura = dataAbertura;
            this.dataFechamento = dataFechamento;
        }
        #endregion

        #region Propriedades
        public int IdTicket { get => idTicket; set => idTicket = value; }
        public int IdUtilizador { get => idUtilizador; set => idUtilizador = value; }
        public string Assunto { get => assunto; set => assunto = value; }
        public string Descricao { get => descricao; set => descricao = value; }
        public string Estado { get => estado; set => estado = value; }
        public DateTime DataAbertura { get => dataAbertura; set => dataAbertura = value; }
        public DateTime? DataFechamento { get => dataFechamento; set => dataFechamento = value; }
        #endregion
    }
}
