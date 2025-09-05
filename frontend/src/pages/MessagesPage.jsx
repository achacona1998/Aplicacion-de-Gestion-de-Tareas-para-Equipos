import React, { useState } from "react";

const MessagesPage = () => {
  // Estado para los contactos y mensajes de ejemplo
  const [contacts, setContacts] = useState([
    { id: 1, name: "Juan Pérez", avatar: "👨‍💼", status: "online", unread: 2 },
    { id: 2, name: "María García", avatar: "👩‍💼", status: "offline", unread: 0 },
    {
      id: 3,
      name: "Carlos Rodríguez",
      avatar: "👨‍💻",
      status: "online",
      unread: 0,
    },
    { id: 4, name: "Ana Martínez", avatar: "👩‍🎨", status: "away", unread: 3 },
    { id: 5, name: "Luis Sánchez", avatar: "👨‍🔧", status: "online", unread: 0 },
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        sender: "them",
        text: "Hola, ¿cómo va el proyecto?",
        time: "10:30",
      },
      {
        id: 2,
        sender: "me",
        text: "Bien, estoy terminando la interfaz de usuario",
        time: "10:32",
      },
      {
        id: 3,
        sender: "them",
        text: "¿Necesitas ayuda con algo?",
        time: "10:33",
      },
      {
        id: 4,
        sender: "me",
        text: "No por ahora, gracias. Te aviso si surge algo",
        time: "10:35",
      },
      {
        id: 5,
        sender: "them",
        text: "Perfecto, recuerda que tenemos reunión mañana",
        time: "10:36",
      },
      {
        id: 6,
        sender: "them",
        text: "No olvides traer la documentación actualizada",
        time: "10:36",
      },
    ],
    2: [
      {
        id: 1,
        sender: "them",
        text: "Hola, ¿revisaste mi último commit?",
        time: "09:15",
      },
      {
        id: 2,
        sender: "me",
        text: "Sí, todo se ve bien. Solo un pequeño detalle en el formulario",
        time: "09:20",
      },
    ],
    3: [
      {
        id: 1,
        sender: "me",
        text: "Hola Carlos, necesito tu ayuda con un bug",
        time: "14:05",
      },
      { id: 2, sender: "them", text: "Claro, dime qué ocurre", time: "14:10" },
      {
        id: 3,
        sender: "me",
        text: "Es sobre la autenticación, no está funcionando correctamente",
        time: "14:12",
      },
    ],
    4: [
      {
        id: 1,
        sender: "them",
        text: "Te envié los diseños por email",
        time: "Ayer",
      },
      { id: 2, sender: "them", text: "¿Los recibiste?", time: "Ayer" },
      {
        id: 3,
        sender: "them",
        text: "Necesito tu feedback para continuar",
        time: "Hoy",
      },
    ],
    5: [
      {
        id: 1,
        sender: "me",
        text: "Hola Luis, ¿cómo va el servidor?",
        time: "Lunes",
      },
      {
        id: 2,
        sender: "them",
        text: "Todo en orden, acabo de hacer el deploy",
        time: "Lunes",
      },
    ],
  });

  const [newMessage, setNewMessage] = useState("");

  // Función para enviar un nuevo mensaje
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages[selectedContact.id].length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages({
      ...messages,
      [selectedContact.id]: [...messages[selectedContact.id], newMsg],
    });

    setNewMessage("");
  };

  // Función para seleccionar un contacto y marcar como leídos sus mensajes
  const selectContact = (contact) => {
    setSelectedContact(contact);

    // Marcar mensajes como leídos
    if (contact.unread > 0) {
      setContacts(
        contacts.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
      );
    }
  };

  // Obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mensajes</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-[calc(100vh-200px)]">
          {/* Lista de contactos */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Buscar contactos..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ul>
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  onClick={() => selectContact(contact)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedContact.id === contact.id ? "bg-blue-50" : ""
                  }`}>
                  <div className="relative">
                    <div className="text-2xl">{contact.avatar}</div>
                    <span
                      className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${getStatusColor(
                        contact.status
                      )}`}></span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </p>
                      {contact.unread > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.status === "online"
                        ? "En línea"
                        : contact.status === "away"
                        ? "Ausente"
                        : "Desconectado"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Área de mensajes */}
          <div className="w-2/3 flex flex-col">
            {/* Encabezado del chat */}
            <div className="p-4 border-b flex items-center">
              <div className="text-2xl">{selectedContact.avatar}</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {selectedContact.name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedContact.status === "online"
                    ? "En línea"
                    : selectedContact.status === "away"
                    ? "Ausente"
                    : "Desconectado"}
                </p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages[selectedContact.id].map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "me"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario para enviar mensajes */}
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
