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
    /// Classe destinada para guardar irformações da Rifa
    /// </summary>
    public class Rifa
    {
        #region Attributes
        private int ID_Rifa;
        private string Nome;
        private string Descricao;
        private float Preco;
        private int Quantidade_Disponivel;
        private string Estado;
        private DateTime Data_Sorteio;
        private string Premio;
        #endregion

        #region Constructors
        public Rifa(int idRifa, string nome, string descricao, float preco, int quantidadeDisponivel, string estado, DateTime dataSorteio, string premio)
        {
            ID_Rifa = idRifa;
            Nome = nome;
            Descricao = descricao;
            Preco = preco;
            Quantidade_Disponivel = quantidadeDisponivel;
            Estado = estado;
            Data_Sorteio = dataSorteio;
            Premio = premio;
        }
        #endregion

        #region Methods
        public void CriarRifa() { }
        public void SortearRifa() { }
        public List<Rifa> ListarRifasDisponiveis() { return new List<Rifa>(); }
        #endregion

        #region Properties
        public int IdRifa { get => ID_Rifa; set => ID_Rifa = value; }
        public string NomeRifa { get => Nome; set => Nome = value; }
        public string DescricaoRifa { get => Descricao; set => Descricao = value; }
        public float PrecoRifa { get => Preco; set => Preco = value; }
        public int QuantidadeDisponivel { get => Quantidade_Disponivel; set => Quantidade_Disponivel = value; }
        public string EstadoRifa { get => Estado; set => Estado = value; }
        public DateTime DataSorteio { get => Data_Sorteio; set => Data_Sorteio = value; }
        public string PremioRifa { get => Premio; set => Premio = value; }
        #endregion
    }
}