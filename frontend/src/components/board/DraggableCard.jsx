import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DraggableCard = ({ card, index, onClick }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
          onClick={() => onClick(card)}
        >
          <h4 className="font-medium text-gray-800 mb-2">{card.title}</h4>
          {card.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {card.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels && Array.isArray(card.labels) && card.labels.map((label, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-full text-xs ${label.color} text-white`}
              >
                {label.text}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            {card.dueDate && (
              <span className="flex items-center">
                <i className="fas fa-calendar-alt mr-1"></i>
                {formatDate(card.dueDate)}
              </span>
            )}
            {card.assignedTo && (
              <span className="flex items-center">
                <i className="fas fa-user mr-1"></i>
                {card.assignedTo}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableCard;