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
    /// Classe destinada para guardar irformações da Avaliação do Evento
    /// </summary>
    public class AvaliacaoEvento
    {

        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe AvaliacaoEvento
        /// </summary>
        private int idAvaliacao;
        private int idUtilizador;
        private int idEvento;
        private int nota;
        private string comentario;
        private DateTime dataAvaliacao;

        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public AvaliacaoEvento()
        {
            idAvaliacao = 0;
            idUtilizador = 0;
            idEvento = 0;
            nota = 0;
            comentario = "";
            dataAvaliacao = DateTime.Now;
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idAvaliacao"></param>
        /// <param name="idUtilizador"></param>
        /// <param name="idEvento"></param>
        /// <param name="nota"></param>
        /// <param name="comentario"></param>
        /// <param name="localizacao"></param>
        /// <param name="dataAvaliacao"></param>
        public AvaliacaoEvento(int idAvaliacao, int idUtilizador, int idEvento, int nota, string comentario, DateTime dataAvaliacao)
        {
            this.idAvaliacao = idAvaliacao;
            this.idUtilizador = idUtilizador;
            this.idEvento = idEvento;
            this.nota = nota;
            this.comentario = comentario;
            this.dataAvaliacao = dataAvaliacao;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Avaliação do Evento
        /// </summary>
        public int IdAvaliacao
        {
            get { return idAvaliacao; }
            set { idAvaliacao = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id do Utilizador que criou a Avaliação do Evento
        /// </summary>
        public int IdUtilizador
        {
            get { return idUtilizador; }
            set { idUtilizador = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id do Evento de onde foi a Avaliação do Evento
        /// </summary>
        public int IdEvento
        {
            get { return idEvento; }
            set { idEvento = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a nota da Avaliação do Evento
        /// </summary>
        public int Nota
        {
            get { return nota; }
            set { nota = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o comentario da Avaliação do Evento
        /// </summary>
        public string Comentario
        {
            get { return comentario; }
            set { comentario = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a data da Avaliação do Evento
        /// </summary>
        public DateTime DataAvaliacao
        {
            get { return dataAvaliacao; }
            set { dataAvaliacao = value; }
        }

        #endregion
        #endregion
    }
}