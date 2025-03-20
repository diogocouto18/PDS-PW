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
    /// Classe destinada para guardar irformações do Utilizador
    /// </summary>
    public class Utilizador
    {
        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Utilizador
        /// </summary>
        private int idUtilizador;
        private string nome;
        private string apelido;
        private string email;
        private string username;
        private string password;
        private string morada;
        private int telefone; 
        private DateTime dataRegisto;
        
        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public Utilizador()
        {
            idUtilizador = 0;
            nome = "";
            apelido = "";
            email = "";
            username = "";
            password = "";
            morada = "";
            telefone = 0;
            dataRegisto = DateTime.Now
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idUtilizador"></param>
        /// <param name="nome"></param>
        /// <param name="apelido"></param>
        /// <param name="email"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="morada"></param>
        /// <param name="telefone"></param>
        /// <param name="dataRegisto"></param>
        public Utilizador(int idUtilizador, string nome, string apelido, string email, string username, string password, string morada, int telefone, DateTime dataRegisto)
        {
            this.idUtilizador = idUtilizador;
            this.nome = nome;
            this.apelido = apelido;
            this.email = email;
            this.username = username;
            this.password = password;
            this.morada = morada;
            this.telefone = telefone;
            this.dataRegisto = dataRegisto;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Utilizador
        /// </summary>
        public int IdUtilizador
        {
            get { return idUtilizador; }
            set { idUtilizador = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o nome do Utilizador
        /// </summary>
        public string Nome
        {
            get { return nome; }
            set { nome = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o apelido do Utilizador
        /// </summary>
        public string Apelido
        {
            get { return apelido; }
            set { apelido = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o email do Utilizador
        /// </summary>
        public string Email
        {
            get { return email; }
            set { email = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o username do Utilizador
        /// </summary>
        public string Username
        {
            get { return username; }
            set { username = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a password do Utilizador
        /// </summary>
        public string Password
        {
            get { return password; }
            set { password = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a morada do Utilizador
        /// </summary>
        public string Morada
        {
            get { return morada; }
            set { morada = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o telefone do Utilizador
        /// </summary>
        public int Telefone
        {
            get { return telefone; }
            set { telefone = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a data de registo do Utilizador
        /// </summary>
        public DateTime DataRegisto
        {
            get { return dataRegisto; }
            set { dataRegisto = value; }
        }

        #endregion
        #endregion
    }
}