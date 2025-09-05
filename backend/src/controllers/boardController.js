const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

const boardController = {
  async createBoard(req, res) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;

      const boardId = await Board.create({ title, description, userId });
      const board = await Board.getById(boardId);

      res.status(201).json(board);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el tablero', error: error.message });
    }
  },

  async getBoards(req, res) {
    try {
      const userId = req.user.id;
      const boards = await Board.getByUserId(userId);
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los tableros', error: error.message });
    }
  },

  async getBoardDetails(req, res) {
    try {
      const { boardId } = req.params;
      const board = await Board.getById(boardId);
      
      if (!board) {
        return res.status(404).json({ message: 'Tablero no encontrado' });
      }

      const lists = await List.getByBoardId(boardId);
      const listsWithCards = await Promise.all(
        lists.map(async (list) => {
          const cards = await Card.getByListId(list.id);
          return { ...list, cards };
        })
      );

      res.json({
        ...board,
        lists: listsWithCards
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los detalles del tablero', error: error.message });
    }
  },

  async updateBoard(req, res) {
    try {
      const { boardId } = req.params;
      const { title, description } = req.body;

      const board = await Board.getById(boardId);
      if (!board) {
        return res.status(404).json({ message: 'Tablero no encontrado' });
      }

      const updated = await Board.update({ boardId, title, description });
      if (updated) {
        const updatedBoard = await Board.getById(boardId);
        res.json(updatedBoard);
      } else {
        res.status(400).json({ message: 'No se pudo actualizar el tablero' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el tablero', error: error.message });
    }
  },

  async deleteBoard(req, res) {
    try {
      const { boardId } = req.params;

      const board = await Board.getById(boardId);
      if (!board) {
        return res.status(404).json({ message: 'Tablero no encontrado' });
      }

      const deleted = await Board.delete(boardId);
      if (deleted) {
        res.json({ message: 'Tablero eliminado correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo eliminar el tablero' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el tablero', error: error.message });
    }
  }
};

module.exports = boardController;