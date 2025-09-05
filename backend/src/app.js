const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Import routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const reportRoutes = require("./routes/reportRoutes");
const projectRoutes = require("./routes/projectRoutes");
const boardRoutes = require("./routes/boardRoutes");
const ganttRoutes = require("./routes/ganttRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/gantt", ganttRoutes);
app.use("/api/v1/integrations", integrationRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de Gestión de Tareas para Equipos",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

module.exports = app;
