const Comment = require("../models/commentModel");
const Task = require("../models/taskModel");

// Controlador para obtener todos los comentarios de una tarea
exports.getCommentsByTaskId = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Verificar si la tarea existe
    const task = await Task.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const comments = await Comment.getCommentsByTaskId(taskId);

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error al obtener comentarios:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener comentarios",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener un comentario por ID
exports.getCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error al obtener comentario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener comentario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para crear un nuevo comentario
exports.createComment = async (req, res) => {
  try {
    const { task_id, comment } = req.body;

    // Validar datos de entrada
    if (!task_id || !comment) {
      return res.status(400).json({
        success: false,
        message: "El ID de la tarea y el comentario son obligatorios",
      });
    }

    // Verificar si la tarea existe
    const task = await Task.getTaskById(task_id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Crear comentario
    const commentData = {
      task_id,
      user_id: req.user.id,
      comment,
    };

    const commentId = await Comment.createComment(commentData);
    const newComment = await Comment.getCommentById(commentId);

    res.status(201).json({
      success: true,
      message: "Comentario creado exitosamente",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error al crear comentario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear comentario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar un comentario
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;

    // Validar datos de entrada
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "El comentario es obligatorio",
      });
    }

    // Verificar si el comentario existe
    const existingComment = await Comment.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    // Verificar si el usuario es el autor del comentario
    if (existingComment.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para editar este comentario",
      });
    }

    // Actualizar comentario
    const commentData = {
      comment,
    };

    await Comment.updateComment(commentId, commentData);
    const updatedComment = await Comment.getCommentById(commentId);

    res.status(200).json({
      success: true,
      message: "Comentario actualizado exitosamente",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error al actualizar comentario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al actualizar comentario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar un comentario
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    // Verificar si el comentario existe
    const existingComment = await Comment.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    // Verificar si el usuario es el autor del comentario o un administrador
    if (existingComment.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este comentario",
      });
    }

    // Eliminar comentario
    await Comment.deleteComment(commentId);

    res.status(200).json({
      success: true,
      message: "Comentario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar comentario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar comentario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
