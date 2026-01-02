require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");

(async () => {
  try {
    const sql = fs.readFileSync("expediente_medico.sql", "utf8");

    const connection = await mysql.createConnection({
      uri: process.env.MYSQL_URL,
      ssl: { rejectUnauthorized: false }
    });

    await connection.query(sql);
    await connection.end();

    console.log("✅ Base de datos importada correctamente");
  } catch (err) {
    console.error("❌ Error al importar la base:", err.message);
  }
})();
