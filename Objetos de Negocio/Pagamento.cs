/*
 * Grupo05
 * a25417, a25426, a25437, a25441, a25442, a27956
 * PDS/PW - LESI
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Objetos_de_Negocio
{
    /// <summary>
    /// Classe destinada para guardar irformações do Pagamento
    /// </summary>
    public class Pagamento
    {
        #region Attributes
        private int ID_Pagamento;
        private int ID_Utilizador;
        private float Valor;
        private string Tipo;
        private string Metodo_Pagamento;
        private DateTime Data_Pagamento;
        #endregion

        #region Constructors
        public Pagamento(int idPagamento, int idUtilizador, float valor, string tipo, string metodoPagamento, DateTime dataPagamento)
        {
            ID_Pagamento = idPagamento;
            ID_Utilizador = idUtilizador;
            Valor = valor;
            Tipo = tipo;
            Metodo_Pagamento = metodoPagamento;
            Data_Pagamento = dataPagamento;
        }
        #endregion

        #region Methods
        public void ProcessarPagamento() { }
        public List<Pagamento> ListarPagamentos() { return new List<Pagamento>(); }
        #endregion

        #region Properties
        public int IdPagamento { get => ID_Pagamento; set => ID_Pagamento = value; }
        public int IdUtilizador { get => ID_Utilizador; set => ID_Utilizador = value; }
        public float ValorPagamento { get => Valor; set => Valor = value; }
        public string TipoPagamento { get => Tipo; set => Tipo = value; }
        public string MetodoPagamento { get => Metodo_Pagamento; set => Metodo_Pagamento = value; }
        public DateTime DataPagamento { get => Data_Pagamento; set => Data_Pagamento = value; }
        #endregion
    }
}