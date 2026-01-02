const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const pacientesRoutes = require("./routes/pacientes");
const historiaClinicaRoutes = require("./routes/historia");
const notasRoutes = require("./routes/notas");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/historia-clinica", historiaClinicaRoutes);
app.use("/api/notas", notasRoutes);

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pacientes.html"));
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
