import React, { useState } from "react";

const CalendarPage = () => {
  // Estado para el mes y año actual
  const [currentDate, setCurrentDate] = useState(new Date());

  // Eventos de ejemplo
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Reunión de equipo",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      type: "meeting",
    },
    {
      id: 2,
      title: "Entrega de diseño",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      type: "deadline",
    },
    {
      id: 3,
      title: "Revisión de código",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      type: "review",
    },
    {
      id: 4,
      title: "Presentación al cliente",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      type: "meeting",
    },
    {
      id: 5,
      title: "Lanzamiento v1.0",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 28),
      type: "milestone",
    },
  ]);

  // Función para obtener el nombre del mes
  const getMonthName = (date) => {
    return date.toLocaleString("es-ES", { month: "long" });
  };

  // Función para obtener el nombre del día de la semana
  const getDayName = (day) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return days[day];
  };

  // Función para ir al mes anterior
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Función para ir al mes siguiente
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Función para ir al mes actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para generar los días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];

    // Días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
        today:
          new Date(year, month, i).toDateString() === new Date().toDateString(),
      });
    }

    // Días del mes siguiente para completar la última semana
    const daysNeeded = 42 - calendarDays.length; // 6 semanas * 7 días = 42
    for (let i = 1; i <= daysNeeded; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return calendarDays;
  };

  // Función para obtener los eventos de un día específico
  const getEventsForDay = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Función para obtener el color según el tipo de evento
  const getEventColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      case "review":
        return "bg-green-100 text-green-800 border-green-200";
      case "milestone":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Generar los días del calendario
  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Calendario</h1>
        <div className="flex space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Mes
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Semana
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Día
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Navegación del calendario */}
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {getDayName(day)}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day.date);
            return (
              <div
                key={index}
                className={`bg-white min-h-[100px] p-2 ${
                  !day.currentMonth ? "text-gray-400" : ""
                } ${day.today ? "bg-blue-50" : ""}`}>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${
                      day.today
                        ? "bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center"
                        : ""
                    }`}>
                    {day.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayEvents.length} evento{dayEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`px-2 py-1 text-xs rounded border ${getEventColor(
                        event.type
                      )}`}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximos eventos */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Próximos eventos
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date - b.date)
              .slice(0, 5)
              .map((event) => (
                <li key={event.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        event.type === "meeting"
                          ? "bg-blue-500"
                          : event.type === "deadline"
                          ? "bg-red-500"
                          : event.type === "review"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            {events.filter((event) => event.date >= new Date()).length ===
              0 && (
              <li className="p-4 text-center text-gray-500 text-sm">
                No hay próximos eventos
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
