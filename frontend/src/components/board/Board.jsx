import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DroppableList from './DroppableList';
import CardModal from './CardModal';

const Board = ({ board, onUpdateBoard }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      const newLists = Array.from(board.lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      const newBoard = {
        ...board,
        lists: newLists.map((list, index) => ({
          ...list,
          position: index
        }))
      };

      onUpdateBoard(newBoard);
      return;
    }

    const sourceList = board.lists.find(
      list => String(list.id) === source.droppableId
    );
    const destList = board.lists.find(
      list => String(list.id) === destination.droppableId
    );
    
    if (!sourceList || !destList) return;

    if (sourceList === destList) {
      const newCards = Array.from(sourceList.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      const newList = {
        ...sourceList,
        cards: newCards.map((card, index) => ({
          ...card,
          position: index
        }))
      };

      const newBoard = {
        ...board,
        lists: board.lists.map(list =>
          list.id === newList.id ? newList : list
        )
      };

      onUpdateBoard(newBoard);
    } else {
      const sourceCards = Array.from(sourceList.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      const destCards = Array.from(destList.cards);
      destCards.splice(destination.index, 0, removed);

      const newBoard = {
        ...board,
        lists: board.lists.map(list => {
          if (list.id === sourceList.id) {
            return {
              ...list,
              cards: sourceCards.map((card, index) => ({
                ...card,
                position: index
              }))
            };
          }
          if (list.id === destList.id) {
            return {
              ...list,
              cards: destCards.map((card, index) => ({
                ...card,
                position: index,
                listId: destList.id
              }))
            };
          }
          return list;
        })
      };

      onUpdateBoard(newBoard);
    }
  };

  const handleAddList = () => {
    const newList = {
      id: Date.now(),
      title: 'Nueva lista',
      position: board.lists.length,
      cards: []
    };

    const newBoard = {
      ...board,
      lists: [...board.lists, newList]
    };

    onUpdateBoard(newBoard);
  };

  const handleEditList = (listId, newTitle) => {
    const newBoard = {
      ...board,
      lists: board.lists.map(list =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    };

    onUpdateBoard(newBoard);
  };

  const handleDeleteList = (listId) => {
    const newBoard = {
      ...board,
      lists: board.lists.filter(list => list.id !== listId)
    };

    onUpdateBoard(newBoard);
  };

  const handleAddCard = (listId) => {
    const newCard = {
      id: Date.now(),
      title: 'Nueva tarjeta',
      description: '',
      position: board.lists.find(list => list.id === listId).cards.length
    };

    const newBoard = {
      ...board,
      lists: board.lists.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    };

    onUpdateBoard(newBoard);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{board.title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="list" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-4 overflow-x-auto pb-4"
            >
              {board.lists.map((list, index) => (
                <DroppableList
                  key={list.id}
                  list={list}
                  index={index}
                  onCardClick={setSelectedCard}
                  onAddCard={handleAddCard}
                  onEditList={handleEditList}
                  onDeleteList={handleDeleteList}
                />
              ))}
              {provided.placeholder}

              <button
                onClick={handleAddList}
                className="flex items-center justify-center w-72 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors flex-shrink-0"
              >
                <i className="fas fa-plus mr-2"></i>
                Añadir lista
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={(updatedCard) => {
            const newBoard = {
              ...board,
              lists: board.lists.map(list => ({
                ...list,
                cards: list.cards.map(card =>
                  card.id === updatedCard.id ? updatedCard : card
                )
              }))
            };
            onUpdateBoard(newBoard);
            setSelectedCard(null);
          }}
          onDelete={(cardId) => {
            const newBoard = {
              ...board,
              lists: board.lists.map(list => ({
                ...list,
                cards: list.cards.filter(card => card.id !== cardId)
              }))
            };
            onUpdateBoard(newBoard);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};

export default Board;