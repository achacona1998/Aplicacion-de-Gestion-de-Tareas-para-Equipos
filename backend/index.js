const dotenv = require("dotenv");
const app = require("./src/app");
const { testConnection } = require("./src/config/database");

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 3000;
const db = testConnection();
// Start server
app.listen(PORT, () => {
  console.log(db);
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
