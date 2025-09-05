import React, { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "Usuario Demo",
    email: "usuario@demo.com",
    language: "es",
    theme: "light",
    notifications: true,
    emailNotifications: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    alert("Configuración guardada");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Configuración</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}>
            Perfil
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "preferences"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("preferences")}>
            Preferencias
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "notifications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notifications")}>
            Notificaciones
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notifications"
                    className="ml-2 block text-sm text-gray-700">
                    Notificaciones en la aplicación
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="emailNotifications"
                    className="ml-2 block text-sm text-gray-700">
                    Notificaciones por email
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
