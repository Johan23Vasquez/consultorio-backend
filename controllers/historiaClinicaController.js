const pool = require("../db");

// ===============================
// OBTENER HISTORIA POR PACIENTE
// ===============================
exports.getHistoriaByPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM historia_clinica WHERE paciente_id = $1",
      [paciente_id]
    );

    if (result.rows.length === 0) {
      return res.json(null); // aún no tiene historia
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener historia clínica" });
  }
};

// ===============================
// CREAR O ACTUALIZAR HISTORIA
// ===============================
exports.saveHistoriaClinica = async (req, res) => {
  try {
    const {
      paciente_id,
      antecedentes_familiares,
      antecedentes_patologicos,
      per,
      ago,
      pa,
      ef
    } = req.body;

    // Verificar si ya existe
    const existe = await pool.query(
      "SELECT id FROM historia_clinica WHERE paciente_id = $1",
      [paciente_id]
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
          ef = $6
        WHERE paciente_id = $7
        `,
        [
          antecedentes_familiares,
          antecedentes_patologicos,
          per,
          ago,
          pa,
          ef,
          paciente_id
        ]
      );

      return res.json({ message: "Historia clínica actualizada" });
    }

    // INSERT
    await pool.query(
      `
      INSERT INTO historia_clinica
      (paciente_id, antecedentes_familiares, antecedentes_patologicos, per, ago, pa, ef)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        paciente_id,
        antecedentes_familiares,
        antecedentes_patologicos,
        per,
        ago,
        pa,
        ef
      ]
    );

    res.json({ message: "Historia clínica creada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar historia clínica" });
  }
};
