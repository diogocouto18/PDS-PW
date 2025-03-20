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
    /// Classe destinada para guardar irformações da Doação
    /// </summary>
    public class Doacao
    {
        #region Attributes
        private int ID_Doacao;
        private int ID_Utilizador;
        private float Valor;
        private string Metodo_Pagamento;
        private DateTime Data_Doacao;
        private string Descricao;
        #endregion

        #region Constructors
        public Doacao(int idDoacao, int idUtilizador, float valor, string metodoPagamento, DateTime dataDoacao, string descricao)
        {
        ID_Doacao = idDoacao;
        ID_Utilizador = idUtilizador;
        Valor = valor;
        Metodo_Pagamento = metodoPagamento;
        Data_Doacao = dataDoacao;
        Descricao = descricao;
        }
        #endregion

        #region Methods
        public void RegistarDoacao() { }
        public List<Doacao> ListarDoacoes() { return new List<Doacao>(); }
        #endregion

        #region Properties
        public int IdDoacao { get => ID_Doacao; set => ID_Doacao = value; }
        public int IdUtilizador { get => ID_Utilizador; set => ID_Utilizador = value; }
        public float ValorDoacao { get => Valor; set => Valor = value; }
        public string MetodoPagamento { get => Metodo_Pagamento; set => Metodo_Pagamento = value; }
        public DateTime DataDoacao { get => Data_Doacao; set => Data_Doacao = value; }
        public string DescricaoDoacao { get => Descricao; set => Descricao = value; }
        #endregion
    }
}