const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
  sexo: String,
  peso: Number,
  altura: Number,
  nacimiento: Date,
  tutor: String,
  telefono: String,
  info: String
});

module.exports = mongoose.model("Paciente", pacienteSchema);
