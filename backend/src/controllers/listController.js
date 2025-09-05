const List = require('../models/List');
const Card = require('../models/Card');

const listController = {
  async createList(req, res) {
    try {
      const { title, boardId } = req.body;
      const maxPosition = await List.getMaxPosition(boardId);
      const position = maxPosition + 1;

      const listId = await List.create({ title, boardId, position });
      const list = await List.getByBoardId(boardId);

      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la lista', error: error.message });
    }
  },

  async updateList(req, res) {
    try {
      const { listId } = req.params;
      const { title } = req.body;

      const updated = await List.update({ listId, title });
      if (updated) {
        res.json({ message: 'Lista actualizada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar la lista' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la lista', error: error.message });
    }
  },

  async updateListPosition(req, res) {
    try {
      const { listId } = req.params;
      const { position } = req.body;

      const updated = await List.updatePosition({ listId, position });
      if (updated) {
        res.json({ message: 'Posición de lista actualizada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar la posición de la lista' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la posición de la lista', error: error.message });
    }
  },

  async deleteList(req, res) {
    try {
      const { listId } = req.params;
      const deleted = await List.delete(listId);

      if (deleted) {
        res.json({ message: 'Lista eliminada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo eliminar la lista' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la lista', error: error.message });
    }
  },

  async getListWithCards(req, res) {
    try {
      const { listId } = req.params;
      const cards = await Card.getByListId(listId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las tarjetas de la lista', error: error.message });
    }
  }
};

module.exports = listController;