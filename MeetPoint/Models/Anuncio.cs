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
    /// Classe destinada para guardar irformações do Anuncio
    /// </summary>
    public class Anuncio
    {
         #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Anuncio
        /// </summary>
        private int idAnuncio;
        private string tipoAnuncio;
        private string descricao;
        private DateTime horario;
        private int idEvento;

        #endregion

        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public Anuncio()
        {
            idAnuncio = 0;
            tipoAnuncio = "";
            descricao = "";
            horario = DateTime.Now;
            idEvento = 0;
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idAnuncio"></param>
        /// <param name="tipoAnuncio"></param>
        /// <param name="descricao"></param>
        /// <param name="horario"></param>
        /// <param name="idEvento"></param>
        public Anuncio(int idAnuncio, string tipoAnuncio, string descricao, DateTime horario, int idEvento)
        {
            this.idAnuncio = idAnuncio;
            this.tipoAnuncio = tipoAnuncio;
            this.descricao = descricao;
            this.horario = horario;
            this.idEvento = idEvento;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Anuncio
        /// </summary>
        public int IdAnuncio
        {
            get { return idAnuncio; }
            set { idAnuncio = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o tipo de Anuncio
        /// </summary>
        public string TipoAnuncio
        {
            get { return tipoAnuncio; }
            set { tipoAnuncio = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a descrição do Anuncio
        /// </summary>
        public string Descricao
        {
            get { return descricao; }
            set { descricao = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o horario do Anuncio
        /// </summary>
        public DateTime Horario
        {
            get { return horario; }
            set { horario = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id de evento do Anuncio
        /// </summary>
        public int IdEvento
        {
            get { return idEvento; }
            set { idEvento = value; }
        }
        #endregion
        #endregion
    }
}