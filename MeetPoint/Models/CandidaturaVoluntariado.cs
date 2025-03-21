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
    /// Classe destinada para guardar irformações da Candidatura de Voluntariado
    /// </summary>
    public class CandidaturaVoluntariado
    {
        public enum estados
        {
            aprovado, 
            pendente,
            recusado
        }

        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Candidatura de Voluntariado
        /// </summary>
        private int idCandidatura;
        private int idUtilizador;
        private int idEvento;
        private estados estado;
        private DateTime dataCandidatura;

        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public CandidaturaVoluntariado()
        {
            idCandidatura = 0;
            idUtilizador = 0;
            idEvento = 0;
            estado = estados.pendente; 
            dataCandidatura = DateTime.Now;
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idCandidatura"></param>
        /// <param name="idUtilizador"></param>
        /// <param name="idEvento"></param>
        /// <param name="estado"></param>
        /// <param name="dataCandidatura"></param>
        public CandidaturaVoluntariado(int idCandidatura, int idUtilizador, int idEvento, estados estado, DateTime dataCandidatura)
        {
            this.idCandidatura = idCandidatura;
            this.idUtilizador = idUtilizador;
            this.idEvento = idEvento;
            this.estado = estado;
            this.dataCandidatura = dataCandidatura;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id da Candidatura de Voluntariado
        /// </summary>
        public int IdCandidatura
        {
            get { return idCandidatura; }
            set { idCandidatura = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id do utilizador para a Candidatura de Voluntariado
        /// </summary>
        public string IdUtilizador
        {
            get { return idUtilizador; }
            set { idUtilizador = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o id de Evento da Candidatura de Voluntariado
        /// </summary>
        public string IdEvento
        {
            get { return idEvento; }
            set { idEvento = value; }
        }

 
        /// <summary>
        /// Propriedade responsavel por definir o estado da Candidatura de Voluntariado
        /// </summary>
        public estados Estado
        {
            get { return estado; }
            set { estado = value; }
        }
        
        /// <summary>
        /// Propriedade responsavel por definir a data de Candidatura de Voluntariado
        /// </summary>
        public DateTime DataCandidatura
        {
            get { return dataCandidatura; }
            set { dataCandidatura = value; }
        }

        #endregion
        #endregion
    }
}