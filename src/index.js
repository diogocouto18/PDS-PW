// Importa as dependências
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Inicializa o dotenv para usar variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();

// Configurações básicas do servidor
app.use(express.json()); // Para o parsing de JSON
app.use(express.urlencoded({ extended: true })); // Para o parsing de dados do formulário
app.use(cors()); // Permitir comunicação com o frontend

// Importa as rotas
const administradorRoutes = require('./Routes/administradores');
const anuncioRoutes = require('./Routes/anuncios');
const authRoutes = require('./Routes/auth');
const avaliacaoEventoRoutes = require('./Routes/avaliacoesEvento');
const candidaturaVoluntariadoRoutes = require('./Routes/candidaturasVoluntariado');
const categoriaEventoRoutes = require('./Routes/categoriasEvento');
const eventoRoutes = require('./Routes/eventos');
const mensagemSuporteRoutes = require('./Routes/mensagensSuporte');
const notificacaoRoutes = require('./Routes/notificacoes');
const pagamentoRoutes = require('./Routes/pagamentos');
const rifaRoutes = require('./Routes/rifas');
const sorteioRifasRoutes = require('./Routes/sorteioRifas');
const suporteRoutes = require('./Routes/suportes');
const utilizadorRoutes = require('./Routes/utilizadores');

// Usa as rotas
app.use('/administradores', administradorRoutes);
app.use('/anuncios', anuncioRoutes);
app.use('/auth', authRoutes);
app.use('/avaliacao-evento', avaliacaoEventoRoutes);
app.use('/candidaturas-voluntariado', candidaturaVoluntariadoRoutes);
app.use('/categoria-evento', categoriaEventoRoutes);
app.use('/eventos', eventoRoutes);
app.use('/mensagens-suporte', mensagemSuporteRoutes);
app.use('/notificacoes', notificacaoRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/rifas', rifaRoutes);
app.use('/sorteio-rifas', sorteioRifasRoutes);
app.use('/suportes', suporteRoutes);
app.use('/utilizadores', utilizadorRoutes);

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está a correr na porta ${PORT}`);
});

module.exports = app;