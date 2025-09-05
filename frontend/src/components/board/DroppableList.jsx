import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';

const DroppableList = ({ list, index, onCardClick, onAddCard, onEditList, onDeleteList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditList(list.id, title);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3" {...provided.dragHandleProps}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-grow">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  autoFocus
                  onBlur={handleSubmit}
                />
              </form>
            ) : (
              <h3
                className="font-medium text-gray-800 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {list.title}
              </h3>
            )}
            <button
              onClick={() => onDeleteList(list.id)}
              className="text-gray-500 hover:text-red-600 ml-2"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>

          <Droppable droppableId={String(list.id)} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[2rem] ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}`}
              >
                {list.cards && Array.isArray(list.cards) && list.cards.map((card, index) => (
                  <DraggableCard
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={onCardClick}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button
            onClick={() => onAddCard(list.id)}
            className="w-full mt-2 py-2 px-3 text-gray-600 hover:bg-gray-200 rounded-md text-sm text-left transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir tarjeta
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default DroppableList;