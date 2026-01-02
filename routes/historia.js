const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ===============================
   OBTENER HISTORIA DE UN PACIENTE
================================ */
router.get("/:paciente_id", async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM historia_clinica WHERE paciente_id = $1",
      [paciente_id]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener historia clínica" });
  }
});

/* ===============================
   CREAR O ACTUALIZAR HISTORIA
================================ */
router.post("/", async (req, res) => {
  try {
    const h = req.body;

    // Verificar si ya existe
    const existe = await pool.query(
      "SELECT id FROM historia_clinica WHERE paciente_id = $1",
      [h.paciente_id]
    );

    if (existe.rows.length > 0) {
      // UPDATE
      await pool.query(
        `
        UPDATE historia_clinica SET
          antecedentes_familiares = $1,
          antecedentes_patologicos = $2,
          per = $3,
          ago = $4,
          pa = $5,
          ef = $6,
          fc = $7,
          fr = $8,
          temperatura = $9,
          ta = $10,
          sat_o2 = $11,
          diagnostico = $12,
          tratamiento = $13
        WHERE paciente_id = $14
        `,
        [
          h.antecedentes_familiares,
          h.antecedentes_patologicos,
          h.per,
          h.ago,
          h.pa,
          h.ef,
          h.fc,
          h.fr,
          h.temperatura,
          h.ta,
          h.sat_o2,
          h.diagnostico,
          h.tratamiento,
          h.paciente_id
        ]
      );

      return res.json({ message: "Historia clínica actualizada" });
    }

    // INSERT
    await pool.query(
      `
      INSERT INTO historia_clinica
      (paciente_id, antecedentes_familiares, antecedentes_patologicos,
       per, ago, pa, ef, fc, fr, temperatura, ta, sat_o2,
       diagnostico, tratamiento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      `,
      [
        h.paciente_id,
        h.antecedentes_familiares,
        h.antecedentes_patologicos,
        h.per,
        h.ago,
        h.pa,
        h.ef,
        h.fc,
        h.fr,
        h.temperatura,
        h.ta,
        h.sat_o2,
        h.diagnostico,
        h.tratamiento
      ]
    );

    res.json({ message: "Historia clínica creada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar historia clínica" });
  }
});

module.exports = router;
