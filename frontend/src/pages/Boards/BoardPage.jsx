import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../../components/board/Board";
import boardService from "../../services/boardService";

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBoard = async () => {
    try {
      const data = await boardService.getBoard(boardId);
      setBoard(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar el tablero");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBoard = async (updatedBoard) => {
    try {
      await boardService.updateBoard(boardId, updatedBoard);
      setBoard(updatedBoard);
    } catch (err) {
      setError("Error al actualizar el tablero");
    }
  };

  const handleDeleteBoard = async () => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este tablero?")
    ) {
      return;
    }

    try {
      await boardService.deleteBoard(boardId);
      navigate("/boards");
    } catch (err) {
      setError("Error al eliminar el tablero");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tablero no encontrado
          </h2>
          <button
            onClick={() => navigate("/boards")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Volver a mis tableros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/boards")}
                className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {board.title}
              </h1>
            </div>
            <button
              onClick={handleDeleteBoard}
              className="px-4 py-2 text-red-600 hover:text-red-800">
              <i className="fas fa-trash mr-2"></i>
              Eliminar tablero
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Board board={board} onUpdateBoard={handleUpdateBoard} />
      </div>
    </div>
  );
};

export default BoardPage;
