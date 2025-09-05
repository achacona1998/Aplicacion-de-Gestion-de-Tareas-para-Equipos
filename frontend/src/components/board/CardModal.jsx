import React, { useState, useEffect } from 'react';

const CardModal = ({ card, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [assignedTo, setAssignedTo] = useState(card.assignedTo || '');
  const [labels, setLabels] = useState(card.labels || []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...card,
      title,
      description,
      dueDate,
      assignedTo,
      labels
    });
  };

  const handleAddLabel = () => {
    const newLabel = {
      text: 'Nueva etiqueta',
      color: 'bg-blue-500'
    };
    setLabels([...labels, newLabel]);
  };

  const handleUpdateLabel = (index, field, value) => {
    const newLabels = [...labels];
    newLabels[index] = { ...newLabels[index], [field]: value };
    setLabels(newLabels);
  };

  const handleDeleteLabel = (index) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const labelColors = [
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Rojo', class: 'bg-red-500' },
    { name: 'Amarillo', class: 'bg-yellow-500' },
    { name: 'Morado', class: 'bg-purple-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-start mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold w-full mr-4 px-2 py-1 border-b-2 border-transparent focus:border-blue-500 focus:outline-none"
              placeholder="Título de la tarjeta"
            />
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="4"
                placeholder="Añade una descripción más detallada..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignado a
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nombre del responsable"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Etiquetas
                </label>
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Añadir etiqueta
                </button>
              </div>
              <div className="space-y-2">
                {labels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={label.text}
                      onChange={(e) => handleUpdateLabel(index, 'text', e.target.value)}
                      className="flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                      value={label.color}
                      onChange={(e) => handleUpdateLabel(index, 'color', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {labelColors.map(color => (
                        <option key={color.class} value={color.class}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteLabel(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => onDelete(card.id)}
              className="px-4 py-2 text-red-600 hover:text-red-800"
            >
              <i className="fas fa-trash mr-2"></i>
              Eliminar tarjeta
            </button>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;