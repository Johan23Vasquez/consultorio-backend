const pool = require("../db");

// ===============================
// CREAR NOTA MÉDICA
// ===============================
exports.crearNota = async (req, res) => {
  try {
    const nota = req.body;

    const sql = `
      INSERT INTO notas_medicas
      (paciente_id, fecha, edad, rc, rr, temperatura, ta, sat_o2,
       vacunas, alimentacion, edi, padecimiento, diagnostico, tratamiento)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id
    `;

    const values = [
      nota.paciente_id,
      nota.fecha,
      nota.edad,
      nota.rc,
      nota.rr,
      nota.temperatura,
      nota.ta,
      nota.sat_o2,
      nota.vacunas,
      nota.alimentacion,
      nota.edi,
      nota.padecimiento,
      nota.diagnostico,
      nota.tratamiento
    ];

    const result = await pool.query(sql, values);

    res.status(201).json({
      message: "Nota médica guardada",
      id: result.rows[0].id
    });

  } catch (error) {
    console.error("❌ Error PostgreSQL:", error);
    res.status(500).json({ error: "Error al guardar nota médica" });
  }
};

// ===============================
// OBTENER NOTAS POR PACIENTE
// ===============================
exports.obtenerNotasPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM notas_medicas
       WHERE paciente_id = $1
       ORDER BY fecha DESC`,
      [pacienteId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("❌ Error PostgreSQL:", error);
    res.status(500).json({ error: "Error al obtener notas" });
  }
};

// ===============================
// OBTENER ÚLTIMA NOTA DEL PACIENTE
// ===============================
exports.getUltimaNota = async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await pool.query(
      `SELECT n.*, p.nombre, p.edad
       FROM notas_medicas n
       JOIN pacientes p ON p.id = n.paciente_id
       WHERE n.paciente_id = $1
       ORDER BY n.fecha DESC
       LIMIT 1`,
      [paciente_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No hay notas médicas" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error PostgreSQL:", error);
    res.status(500).json({ error: "Error al obtener nota médica" });
  }
};
