const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const pacientesRoutes = require("./routes/pacientes");
const historiaClinicaRoutes = require("./routes/historia");
const notasRoutes = require("./routes/notas");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(bodyParser.json());

// ===============================
// RUTAS API
// ===============================
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/historia-clinica", historiaClinicaRoutes);
app.use("/api/notas", notasRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "API Consultorio funcionando ✅" });
});

// ===============================
// SERVIDOR
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
