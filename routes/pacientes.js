const express = require("express");
const router = express.Router();
const controller = require("../controllers/pacientesController");


router.get("/buscar/:texto", controller.buscarPacientes);
router.get("/", controller.getPacientes);
router.get("/:id", controller.getPacienteById);  
router.post("/", controller.createPaciente);
router.put("/:id", controller.updatePaciente);    


module.exports = router;
