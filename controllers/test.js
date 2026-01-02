const pool = require("../db");

(async () => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    console.log("Tablas:", rows);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
