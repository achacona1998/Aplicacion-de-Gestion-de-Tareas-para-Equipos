import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import boardService from "../services/boardService";

export const Board = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Inicialmente usamos los datos de ejemplo mientras se implementa la integración completa
    setCards(DEFAULT_CARDS);
    setLoading(false);
    
    // Comentado hasta que se implemente la integración completa con el backend
    /*
    const fetchCards = async () => {
      try {
        // Asumimos que hay un tablero predeterminado con ID 1
        // En una implementación completa, esto vendría de un estado o parámetro de ruta
        const boardId = '1';
        const boardData = await boardService.getBoard(boardId);
        
        // Transformar los datos del backend al formato que espera nuestro componente
        const transformedCards = [];
        
        // Aquí iría la lógica para transformar los datos del backend
        // al formato que espera nuestro componente
        
        setCards(transformedCards.length > 0 ? transformedCards : DEFAULT_CARDS);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las tarjetas:', err);
        setError('No se pudieron cargar las tarjetas');
        setLoading(false);
      }
    };
    
    fetchCards();
    */
  }, []);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Pendiente"
        column="backlog"
        headingColor="text-gray-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Por hacer"
        column="todo"
        headingColor="text-yellow-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="En progreso"
        column="doing"
        headingColor="text-blue-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Completado"
        column="done"
        headingColor="text-green-500"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-64 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full rounded-lg border border-gray-200 p-2 transition-colors ${
          active ? "bg-blue-100/50" : "bg-white"
        }`}>
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-gray-300 bg-white p-3 shadow-sm hover:shadow-md active:cursor-grabbing">
        <p className="text-sm text-gray-800">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-blue-500 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-64 shrink-0 place-content-center rounded-lg border text-3xl ${
        active
          ? "border-red-500 bg-red-100 text-red-500"
          : "border-gray-300 bg-gray-100 text-gray-400"
      }`}>
      {active ? "" : ""}
    </div>
  );
};

const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Añadir nueva tarea..."
            className="w-full rounded border border-blue-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700">
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-blue-500 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-600">
              <span>Añadir</span>+
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-blue-500 transition-colors hover:text-blue-700">
          <span>Añadir tarjeta</span>+
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Revisar error de renderizado en el dashboard", id: "1", column: "backlog" },
  { title: "Crear lista de verificación de cumplimiento", id: "2", column: "backlog" },
  { title: "Migrar base de datos a nuevo servidor", id: "3", column: "backlog" },
  { title: "Documentar servicio de notificaciones", id: "4", column: "backlog" },
  // TODO
  {
    title: "Investigar opciones de BD para nuevo microservicio",
    id: "5",
    column: "todo",
  },
  { title: "Análisis post-incidente de la caída del sistema", id: "6", column: "todo" },
  { title: "Sincronizar con producto sobre el plan trimestral", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactorizar proveedores de contexto para usar Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Añadir registro de eventos a tareas programadas", id: "9", column: "doing" },
  // DONE
  {
    title: "Configurar paneles de monitoreo para el servicio de escucha",
    id: "10",
    column: "done",
  },
];
