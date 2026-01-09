const pool = require("../db");

// ===============================
// OBTENER TODOS LOS PACIENTES
// ===============================
exports.getPacientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pacientes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
};

// ===============================
// OBTENER PACIENTE POR ID
// ===============================
exports.getPacienteById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pacientes WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// ===============================
// ACTUALIZAR PACIENTE
// ===============================
exports.updatePaciente = async (req, res) => {
  try {
    const {
      nombre, edad, sexo, peso,
      altura, tutor, telefono, info
    } = req.body;

    await pool.query(`
      UPDATE pacientes SET
        nombre = $1,
        edad = $2,
        sexo = $3,
        peso = $4,
        altura = $5,
        tutor = $6,
        telefono = $7,
        info = $8
      WHERE id = $9
    `, [
      nombre,
      edad === "" || edad === null ? null : Number(edad),
      sexo || null,
      peso === "" || peso === null ? null : Number(peso),
      altura === "" || altura === null ? null : Number(altura),
      tutor || null,
      telefono || null,
      info || null,
      req.params.id
    ]);

    res.json({ message: "Paciente actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar paciente" });
  }
};


// ===============================
// CREAR PACIENTE
// ===============================
exports.createPaciente = async (req, res) => {
  try {
    const {
      nombre, edad, sexo, peso,
      altura, tutor, telefono, info
    } = req.body;

    await pool.query(`
      INSERT INTO pacientes
      (nombre, edad, sexo, peso, altura, tutor, telefono, info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      nombre,
      edad === "" || edad === null ? null : Number(edad),
      sexo || null,
      peso === "" || peso === null ? null : Number(peso),
      altura === "" || altura === null ? null : Number(altura),
      tutor || null,
      telefono || null,
      info || null
    ]);

    res.json({ message: "Paciente creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear paciente" });
  }
};

// ===============================
// BUSCAR PACIENTES
// ===============================
exports.buscarPacientes = async (req, res) => {
  try {
    const texto = `%${req.params.texto}%`;

    const result = await pool.query(
      `SELECT * FROM pacientes 
       WHERE nombre ILIKE $1
          OR tutor ILIKE $1
          OR telefono ILIKE $1`,
      [texto]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar pacientes" });
  }
};
