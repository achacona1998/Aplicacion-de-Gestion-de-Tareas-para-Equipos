import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import boardService from "../../services/boardService";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBoards();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBoards = async () => {
    try {
      const data = await boardService.getBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los tableros");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const newBoard = await boardService.createBoard({
        title: newBoardTitle,
        lists: [],
      });
      setBoards([...boards, newBoard]);
      setNewBoardTitle("");
      setIsCreating(false);
    } catch (err) {
      setError("Error al crear el tablero");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mis Tableros</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <i className="fas fa-plus mr-2"></i>
          Nuevo Tablero
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isCreating && (
          <form
            onSubmit={handleCreateBoard}
            className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500 border-dashed">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Título del tablero"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewBoardTitle("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newBoardTitle.trim()}>
                Crear
              </button>
            </div>
          </form>
        )}

        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {board.title}
            </h3>
            <div className="flex items-center text-gray-600">
              <i className="fas fa-list mr-2"></i>
              <span>{board.lists?.length || 0} listas</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;
