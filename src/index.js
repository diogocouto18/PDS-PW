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


// Monta os endpoints
app.use("/utilizadores", utilizadoresRoutes);
app.use("/administradores", administradoresRoutes);

// Rotas de autenticação
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);


app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});





