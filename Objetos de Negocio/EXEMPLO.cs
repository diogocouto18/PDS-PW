/*
 * Diogo Antunes
 * a25441
 * POO - LESI
 * 07/11/2024
 */

using ObjetosNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ObjetosNegocio
{
    /// <summary>
    /// Classe destinada para guardar irformações do Alojamento
    /// </summary>
    public class Alojamento
    {

        #region Atributos

        /// <summary>
        /// Atributos declarados para a classe Alojamento
        /// </summary>
        private int idAlojamento;
        private string localizacao;
        private int capacidade;
        private bool disponiblidade;
        private bool hotel;
        private bool apartamento;
        private double precoNoite;

        #endregion


        #region Metodos

        #region Construtores

        /// <summary>
        /// Construtor padrão que inicia os atributos com valor padrão
        /// </summary>   
        public Alojamento()
        {
            idAlojamento = 0;
            localizacao = "";
            capacidade = 0;
            disponiblidade = false;
            hotel = false;
            apartamento = false;
            precoNoite = 0;
        }

        /// <summary>
        /// Construtor que permite definir todos os atributos ao criar uma instância da classe
        /// </summary>
        /// <param name="idAlojamento"></param>
        /// <param name="localizacao"></param>
        /// <param name="capacidade"></param>
        /// <param name="disponiblidade"></param>
        /// <param name="hotel"></param>
        /// <param name="apartamento"></param>
        /// <param name="precoNoite"></param>
        public Alojamento(int idAlojamento, string localizacao, int capacidade, bool disponiblidade, bool hotel, bool apartamento, double precoNoite)
        {
            this.idAlojamento = idAlojamento;
            this.localizacao = localizacao;
            this.capacidade = capacidade;
            this.disponiblidade = disponiblidade;
            this.hotel = hotel;
            this.apartamento = apartamento;
            this.precoNoite = precoNoite;
        }

        #endregion


        #region Propriedades

        /// <summary>
        /// Propriedade responsavel por definir o id do Alojamento
        /// </summary>
        public int IdAlojamento
        {
            get { return idAlojamento; }
            set { idAlojamento = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir da localização do Alojamento
        /// </summary>
        public string Localizacao
        {
            get { return localizacao; }
            set { localizacao = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a capacidade de numero de pessoas do Alojamento
        /// </summary>
        public int Capacidade
        {
            get { return capacidade; }
            set { capacidade = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir a disponiblidade do Alojamento
        /// </summary>
        public bool Disponiblidade
        {
            get { return disponiblidade; }
            set { disponiblidade = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir se o Alojamento é um Hotel
        /// </summary>
        public bool Hotel
        {
            get { return hotel; }
            set { hotel = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir se o Alojamento é um Apartamento
        /// </summary>
        public bool Apartamento
        {
            get { return apartamento; }
            set { apartamento = value; }
        }

        /// <summary>
        /// Propriedade responsavel por definir o preço de cada noite no Alojamento
        /// </summary>
        public double PrecoNoite
        {
            get { return precoNoite; }
            set { precoNoite = value; }
        }


        #endregion


        #endregion

    }
}