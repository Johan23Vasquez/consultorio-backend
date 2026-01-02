const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ===============================
   OBTENER NOTAS POR PACIENTE
================================ */
router.get("/paciente/:paciente_id", async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM notas_medicas
      WHERE paciente_id = $1
      ORDER BY fecha DESC, id DESC
      `,
      [paciente_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error obtener notas:", error);
    res.status(500).json({ error: "Error al obtener notas médicas" });
  }
});

/* ===============================
   CREAR NOTA MÉDICA
================================ */
router.post("/", async (req, res) => {
  try {
    const n = req.body;

    if (!n.paciente_id || !n.fecha) {
      return res.status(400).json({ error: "Datos obligatorios faltantes" });
    }

    await pool.query(
      `
      INSERT INTO notas_medicas
      (paciente_id, fecha, edad, rc, rr, temperatura, ta, sat_o2,
       padecimiento, diagnostico, tratamiento)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        Number(n.paciente_id),
        n.fecha,
        n.edad ? Number(n.edad) : null,
        n.rc ? Number(n.rc) : null,
        n.rr ? Number(n.rr) : null,
        n.temperatura ? Number(n.temperatura) : null,
        n.ta || null,
        n.sat_o2 ? Number(n.sat_o2) : null,
        n.padecimiento || "",
        n.diagnostico || "",
        n.tratamiento || ""
      ]
    );

    res.json({ message: "Nota médica creada" });
  } catch (error) {
    console.error("❌ Error crear nota:", error);
    res.status(500).json({ error: "Error al crear nota médica" });
  }
});

/* ===============================
   OBTENER ÚLTIMA NOTA DEL PACIENTE
================================ */
router.get("/ultima/:paciente_id", async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM notas_medicas
      WHERE paciente_id = $1
      ORDER BY fecha DESC, id DESC
      LIMIT 1
      `,
      [paciente_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No hay nota médica" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error obtener última nota:", error);
    res.status(500).json({ error: "Error al obtener última nota" });
  }
});

module.exports = router;
