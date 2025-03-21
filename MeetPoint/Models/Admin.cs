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
    /// Classe destinada para guardar irformações do Admin
    /// </summary>
    public class Admin
    {
        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Admin
        /// </summary>
        private int idAdmin;
        private string nome;
        private string email;
        private string username;
        private string password;

        #endregion

        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public Admin()
        {
            idAdmin = 0;
            nome = "";
            email = "";
            username = "";
            password = "";
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idAdmin"></param>
        /// <param name="nome"></param>
        /// <param name="email"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        public Admin(int idAdmin, string nome, string email, string username, string password)
        {
            this.idAdmin = idAdmin;
            this.nome = nome;
            this.email = email;
            this.username = username;
            this.password = password;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Admin
        /// </summary>
        public int IdAdmin
        {
            get { return idAdmin; }
            set { idAdmin = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o nome do Admin
        /// </summary>
        public string Nome
        {
            get { return nome; }
            set { nome = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o email do Admin
        /// </summary>
        public string Email
        {
            get { return email; }
            set { email = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o username do Admin
        /// </summary>
        public string Username
        {
            get { return username; }
            set { username = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a password do Admin
        /// </summary>
        public string Password
        {
            get { return password; }
            set { password = value; }
        }

        #endregion
        #endregion
    }
}
