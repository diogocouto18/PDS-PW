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
    /// Classe destinada para guardar irformações da Categoria do Evento
    /// </summary>
    public class CategoriaEvento
    {

        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe CategoriaEvento
        /// </summary>
        private int idCategoria;
        private string nome;

        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public CategoriaEvento()
        {
            idCategoria = 0;
            nome = "";
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idCategoria"></param>
        /// <param name="nome"></param>
        public CategoriaEvento(int idCategoria, string nome)
        {
            this.idCategoria = idCategoria;
            this.nome = nome;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id da Categoria do Evento
        /// </summary>
        public int IdCategoria
        {
            get { return idCategoria; }
            set { idCategoria = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o nome da Categoria do Evento
        /// </summary>
        public string Nome
        {
            get { return nome; }
            set { nome = value; }
        }

        #endregion
        #endregion
    }
}