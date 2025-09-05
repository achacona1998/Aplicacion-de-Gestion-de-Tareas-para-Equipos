import React, { useState, useEffect } from 'react';
import { Board } from "../components/KanbanBoardComponent";
import boardService from '../services/boardService';

export default function KanbanBoard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardService.getBoards();
        setBoards(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los tableros:', err);
        setError('No se pudieron cargar los tableros. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-blue-500">Cargando tableros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tablero Kanban</h1>
      <Board />
    </div>
  );
}
