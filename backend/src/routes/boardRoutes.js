const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const listController = require('../controllers/listController');
const cardController = require('../controllers/cardController');
const { protect: authenticateToken } = require('../middleware/authMiddleware');

// Rutas de tableros
router.post('/', authenticateToken, boardController.createBoard);
router.get('/', authenticateToken, boardController.getBoards);
router.get('/:boardId', authenticateToken, boardController.getBoardDetails);
router.put('/:boardId', authenticateToken, boardController.updateBoard);
router.delete('/:boardId', authenticateToken, boardController.deleteBoard);

// Rutas de listas
router.post('/:boardId/lists', authenticateToken, listController.createList);
router.put('/:boardId/lists/:listId', authenticateToken, listController.updateList);
router.put('/:boardId/lists/:listId/position', authenticateToken, listController.updateListPosition);
router.delete('/:boardId/lists/:listId', authenticateToken, listController.deleteList);
router.get('/:boardId/lists/:listId/cards', authenticateToken, listController.getListWithCards);

// Rutas de tarjetas
router.post('/:boardId/lists/:listId/cards', authenticateToken, cardController.createCard);
router.get('/:boardId/cards/:cardId', authenticateToken, cardController.getCard);
router.put('/:boardId/cards/:cardId', authenticateToken, cardController.updateCard);
router.put('/:boardId/cards/:cardId/position', authenticateToken, cardController.updateCardPosition);
router.delete('/:boardId/cards/:cardId', authenticateToken, cardController.deleteCard);

module.exports = router;