// src/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware para aceitar JSON e permitir CORS
app.use(express.json());
app.use(cors());

// Importar todas as rotas
const utilizadoresRoutes = require("./Routes/utilizadores");
const administradoresRoutes = require("./Routes/administradores");
const authRoutes = require("./Routes/auth");
const eventosRoutes = require("./Routes/eventos");
const anunciosRoutes = require("./Routes/anuncios");
const candidaturasVoluntariadoRoutes = require("./Routes/candidaturasVoluntariado");
const categoriasEventoRoutes = require("./Routes/categoriasEvento");
const suportesRoutes = require("./Routes/suportes");
const mensagensSuporteRoutes = require("./Routes/mensagensSuporte");
const notificacoesRoutes = require("./Routes/notificacoes");
const avaliacoesEventoRoutes = require("./Routes/avaliacoesEvento");

// Rotas de Rifas, ComprasRifa, Pagamentos ainda precisam ser feitas!
// Quando criares esses routes podes adicionar:
// const rifasRoutes = require("./Routes/rifas");
// const comprasRifaRoutes = require("./Routes/comprasRifa");
// const pagamentosRoutes = require("./Routes/pagamentos");

// Montar as rotas
app.use("/utilizadores", utilizadoresRoutes);
app.use("/administradores", administradoresRoutes);
app.use("/auth", authRoutes);
app.use("/eventos", eventosRoutes);
app.use("/anuncios", anunciosRoutes);
app.use("/candidaturas", candidaturasVoluntariadoRoutes);
app.use("/categorias", categoriasEventoRoutes);
app.use("/suportes", suportesRoutes);
app.use("/mensagensSuporte", mensagensSuporteRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/avaliacoes", avaliacoesEventoRoutes);


// Quando tiveres Rifas, ComprasRifa, Pagamentos:
// app.use("/rifas", rifasRoutes);
// app.use("/comprasRifa", comprasRifaRoutes);
// app.use("/pagamentos", pagamentosRoutes);

// Rota raiz (opcional)
app.get("/", (req, res) => {
    res.send("API PDS Final online! ✨");
});

// Ligar o servidor
app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});

