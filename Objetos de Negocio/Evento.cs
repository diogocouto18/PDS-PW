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
    /// Classe destinada para guardar irformações do Evento
    /// </summary>
    public class Evento
    {
         #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Evento
        /// </summary>
        private int idEvento;
        private int idAdmin;
        private int idCategoria;
        private string nome;
        private string descricao;
        private string localizacao;
        private DateTime data;
        
        //private status;

        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public Evento()
        {
            idEvento = 0;
            idAdmin = 0;
            idCategoria = 0;
            nome = "";
            descricao = "";
            localizacao = "";
            data = DateTime.Now;
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idEvento"></param>
        /// <param name="idAdmin"></param>
        /// <param name="idCategoria"></param>
        /// <param name="nome"></param>
        /// <param name="descricao"></param>
        /// <param name="localizacao"></param>
        /// <param name="data"></param>
        public Evento(int idEvento, int idAdmin, int idCategoria, string nome, string descricao, string localizacao, DateTime data)
        {
            this.idEvento = idEvento;
            this.idAdmin = idAdmin;
            this.idCategoria = idCategoria;
            this.nome = nome;
            this.descricao = descricao;
            this.localizacao = localizacao;
            this.data = data;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Evento
        /// </summary>
        public int IdEvento
        {
            get { return idEvento; }
            set { idEvento = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id do Admin que criou o Evento
        /// </summary>
        public int IdAdmin
        {
            get { return idAdmin; }
            set { idAdmin = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id da categoria do Evento
        /// </summary>
        public int IdCategoria
        {
            get { return idCategoria; }
            set { idCategoria = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o nome do Evento
        /// </summary>
        public string Nome
        {
            get { return nome; }
            set { nome = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a descrição do Evento
        /// </summary>
        public string Descricao
        {
            get { return descricao; }
            set { descricao = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a localização do Evento
        /// </summary>
        public string Localizacao
        {
            get { return localizacao; }
            set { localizacao = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a data do Evento
        /// </summary>
        public DateTime Data
        {
            get { return data; }
            set { data = value; }
        }

        #endregion
        #endregion
    }
}