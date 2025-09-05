import axios from 'axios';

const API_URL = '/api/v1/boards';

const boardService = {
  // Obtener todos los tableros del usuario
  getBoards: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Obtener un tablero específico con sus listas y tarjetas
  getBoard: async (boardId) => {
    const response = await axios.get(`${API_URL}/${boardId}`);
    return response.data;
  },

  // Crear un nuevo tablero
  createBoard: async (boardData) => {
    const response = await axios.post(API_URL, boardData);
    return response.data;
  },

  // Actualizar un tablero
  updateBoard: async (boardId, boardData) => {
    const response = await axios.put(`${API_URL}/${boardId}`, boardData);
    return response.data;
  },

  // Eliminar un tablero
  deleteBoard: async (boardId) => {
    const response = await axios.delete(`${API_URL}/${boardId}`);
    return response.data;
  },

  // Crear una nueva lista en un tablero
  createList: async (boardId, listData) => {
    const response = await axios.post(`${API_URL}/${boardId}/lists`, listData);
    return response.data;
  },

  // Actualizar una lista
  updateList: async (boardId, listId, listData) => {
    const response = await axios.put(`${API_URL}/${boardId}/lists/${listId}`, listData);
    return response.data;
  },

  // Eliminar una lista
  deleteList: async (boardId, listId) => {
    const response = await axios.delete(`${API_URL}/${boardId}/lists/${listId}`);
    return response.data;
  },

  // Actualizar la posición de una lista
  updateListPosition: async (boardId, listId, position) => {
    const response = await axios.patch(`${API_URL}/${boardId}/lists/${listId}/position`, { position });
    return response.data;
  },

  // Crear una nueva tarjeta en una lista
  createCard: async (boardId, listId, cardData) => {
    const response = await axios.post(`${API_URL}/${boardId}/lists/${listId}/cards`, cardData);
    return response.data;
  },

  // Actualizar una tarjeta
  updateCard: async (boardId, listId, cardId, cardData) => {
    const response = await axios.put(`${API_URL}/${boardId}/cards/${cardId}`, cardData);
    return response.data;
  },

  // Eliminar una tarjeta
  deleteCard: async (boardId, listId, cardId) => {
    const response = await axios.delete(`${API_URL}/${boardId}/cards/${cardId}`);
    return response.data;
  },

  // Actualizar la posición de una tarjeta
  updateCardPosition: async (boardId, listId, cardId, position) => {
    const response = await axios.put(
      `${API_URL}/${boardId}/cards/${cardId}/position`,
      { position }
    );
    return response.data;
  },

  // Mover una tarjeta a otra lista
  moveCard: async (boardId, sourceListId, targetListId, cardId, position) => {
    const response = await axios.put(
      `${API_URL}/${boardId}/cards/${cardId}/position`,
      { listId: targetListId, position }
    );
    return response.data;
  }
};

export default boardService;