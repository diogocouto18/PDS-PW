require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");


app.use(cors());
app.use(express.json());

// Importa as rotas de cada entidade
const utilizadoresRoutes = require("./routes/utilizadores");
const administradoresRoutes = require("./routes/administradores");

// ... Outras importações e middlewares
const suporteRoutes = require("./routes/suportes");
app.use("/suportes", suporteRoutes);

const comprasRifaRoutes = require("./routes/comprasRifa");
app.use("/comprasRifa", comprasRifaRoutes);

const candidaturasRoutes = require("./routes/candidaturasVoluntariado");
app.use("/candidaturas", candidaturasRoutes);

const rifasRoutes = require("./routes/rifas");
app.use("/rifas", rifasRoutes);

const eventosRoutes = require("./routes/eventos");
app.use("/eventos", eventosRoutes);

const anunciosRoutes = require("./routes/anuncios");
app.use("/anuncios", anunciosRoutes);

// Rotas de CategoriaEvento
const categoriasEventoRoutes = require("./routes/categoriasEvento");
app.use("/categoriasEvento", categoriasEventoRoutes);

// Monta os endpoints
app.use("/utilizadores", utilizadoresRoutes);
app.use("/administradores", administradoresRoutes);

// Rotas de autenticação
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);


app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});





