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
    /// Classe destinada para guardar irformações da Compra de Rifa
    /// </summary>
    public class CompraRifa
    {
        #region Attributes
        private int ID_Compra;
        private int ID_Utilizador;
        private int ID_Rifa;
        private DateTime Data_Compra;
        private string Estado;
        private string Codigo_Sorteio;
        #endregion

        #region Constructors
        public CompraRifa(int idCompra, int idUtilizador, int idRifa, DateTime dataCompra, string estado, string codigoSorteio)
        {
            ID_Compra = idCompra;
            ID_Utilizador = idUtilizador;
            ID_Rifa = idRifa;
            Data_Compra = dataCompra;
            Estado = estado;
            Codigo_Sorteio = codigoSorteio;
        }
        #endregion

        #region Methods
        public void RegistarCompra() { }
        public bool VerificarRifaGanha() { return false; }
        #endregion

        #region Properties
        public int IdCompra { get => ID_Compra; set => ID_Compra = value; }
        public int IdUtilizador { get => ID_Utilizador; set => ID_Utilizador = value; }
        public int IdRifa { get => ID_Rifa; set => ID_Rifa = value; }
        public DateTime DataCompra { get => Data_Compra; set => Data_Compra = value; }
        public string EstadoCompra { get => Estado; set => Estado = value; }
        public string CodigoSorteio { get => Codigo_Sorteio; set => Codigo_Sorteio = value; }
        #endregion
    }
}