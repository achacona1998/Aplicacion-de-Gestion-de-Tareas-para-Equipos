import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getUnreadMessages,
  markMessageAsRead,
  deleteMessage,
} from "../services/messages";

const MessageMenu = () => {
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnreadMessages();
      setMessages(Array.isArray(data) ? data : []);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Error al cargar los mensajes");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 60000); // refrescar cada 60s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsRead(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center">
      <button onClick={() => setShowMenu(!showMenu)} className="relative">
        <MessageCircle className="w-8 h-8" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-8 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Mensajes</h3>
          </div>

          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Cargando mensajes...
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No tienes mensajes nuevos
            </div>
          )}

          {!loading && !error && messages.length > 0 &&
            messages.map((message) => (
              <div
                key={message.id}
                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">
                    {message.title}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
                {message.reference_id && (
                  <Link
                    to={`/messages/${message.reference_id}`}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    onClick={() => {
                      handleMarkAsRead(message.id);
                      setShowMenu(false);
                    }}>
                    Ver detalles
                  </Link>
                )}
              </div>
            ))}

          <div className="px-4 py-2 border-t border-gray-200">
            <Link
              to="/messages"
              className="text-xs text-blue-600 hover:text-blue-800 block text-center"
              onClick={() => setShowMenu(false)}>
              Ver todos los mensajes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageMenu;