const Card = require('../models/Card');

const cardController = {
  async createCard(req, res) {
    try {
      const { title, description, listId, dueDate, assignedTo, labels } = req.body;
      const maxPosition = await Card.getMaxPosition(listId);
      const position = maxPosition + 1;

      const cardId = await Card.create({
        title,
        description,
        listId,
        position,
        dueDate,
        assignedTo,
        labels: labels || []
      });

      const card = await Card.getById(cardId);
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la tarjeta', error: error.message });
    }
  },

  async getCard(req, res) {
    try {
      const { cardId } = req.params;
      const card = await Card.getById(cardId);

      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }

      res.json(card);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarjeta', error: error.message });
    }
  },

  async updateCard(req, res) {
    try {
      const { cardId } = req.params;
      const { title, description, dueDate, assignedTo, labels } = req.body;

      const card = await Card.getById(cardId);
      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }

      const updated = await Card.update({
        cardId,
        title,
        description,
        dueDate,
        assignedTo,
        labels: labels || []
      });

      if (updated) {
        const updatedCard = await Card.getById(cardId);
        res.json(updatedCard);
      } else {
        res.status(400).json({ message: 'No se pudo actualizar la tarjeta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la tarjeta', error: error.message });
    }
  },

  async updateCardPosition(req, res) {
    try {
      const { cardId } = req.params;
      const { listId, position } = req.body;

      const card = await Card.getById(cardId);
      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }

      const updated = await Card.updatePosition({ cardId, listId, position });
      if (updated) {
        res.json({ message: 'Posición de tarjeta actualizada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar la posición de la tarjeta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la posición de la tarjeta', error: error.message });
    }
  },

  async deleteCard(req, res) {
    try {
      const { cardId } = req.params;
      
      const card = await Card.getById(cardId);
      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }

      const deleted = await Card.delete(cardId);
      if (deleted) {
        res.json({ message: 'Tarjeta eliminada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo eliminar la tarjeta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la tarjeta', error: error.message });
    }
  }
};

module.exports = cardController;