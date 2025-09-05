import { useState, useEffect } from "react";
import {
  getTeamIntegrations,
  configureSlackIntegration,
  configureTeamsIntegration,
  testIntegration,
  toggleIntegrationStatus,
  deleteIntegration,
} from "../../services/integrations";

const IntegrationsConfig = ({ teamId }) => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slackConfig, setSlackConfig] = useState({
    webhookUrl: "",
    channel: "",
  });
  const [teamsConfig, setTeamsConfig] = useState({
    webhookUrl: "",
  });

  // Cargar integraciones existentes
  useEffect(() => {
    const loadIntegrations = async () => {
      setLoading(true);
      try {
        const data = await getTeamIntegrations(teamId);
        setIntegrations(data);
      } catch (err) {
        setError("Error al cargar las integraciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadIntegrations();
    }
  }, [teamId]);

  // Configurar Slack
  const handleSlackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await configureSlackIntegration(teamId, slackConfig);
      setIntegrations([...integrations, data]);
      setSlackConfig({ webhookUrl: "", channel: "" });
    } catch (err) {
      setError("Error al configurar Slack");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Configurar Microsoft Teams
  const handleTeamsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await configureTeamsIntegration(teamId, teamsConfig);
      setIntegrations([...integrations, data]);
      setTeamsConfig({ webhookUrl: "" });
    } catch (err) {
      setError("Error al configurar Microsoft Teams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Probar integración
  const handleTestIntegration = async (integrationId) => {
    try {
      await testIntegration(integrationId);
      alert("Mensaje de prueba enviado con éxito");
    } catch (err) {
      alert("Error al enviar mensaje de prueba");
      console.error(err);
    }
  };

  // Activar/desactivar integración
  const handleToggleStatus = async (integrationId, currentStatus) => {
    try {
      await toggleIntegrationStatus(integrationId, !currentStatus);
      setIntegrations(
        integrations.map((integration) =>
          integration.id === integrationId
            ? { ...integration, isActive: !currentStatus }
            : integration
        )
      );
    } catch (err) {
      setError("Error al cambiar el estado de la integración");
      console.error(err);
    }
  };

  // Eliminar integración
  const handleDeleteIntegration = async (integrationId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta integración?")) return;

    try {
      await deleteIntegration(integrationId);
      setIntegrations(
        integrations.filter((integration) => integration.id !== integrationId)
      );
    } catch (err) {
      setError("Error al eliminar la integración");
      console.error(err);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">
        Configuración de Integraciones
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Formulario de Slack */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Integración con Slack</h3>
        <form onSubmit={handleSlackSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Webhook URL
              <input
                type="text"
                value={slackConfig.webhookUrl}
                onChange={(e) =>
                  setSlackConfig({ ...slackConfig, webhookUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Canal
              <input
                type="text"
                value={slackConfig.channel}
                onChange={(e) =>
                  setSlackConfig({ ...slackConfig, channel: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}>
            Configurar Slack
          </button>
        </form>
      </div>

      {/* Formulario de Microsoft Teams */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Integración con Microsoft Teams
        </h3>
        <form onSubmit={handleTeamsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Webhook URL
              <input
                type="text"
                value={teamsConfig.webhookUrl}
                onChange={(e) =>
                  setTeamsConfig({ ...teamsConfig, webhookUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}>
            Configurar Microsoft Teams
          </button>
        </form>
      </div>

      {/* Lista de integraciones configuradas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Integraciones Activas</h3>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="border p-4 rounded flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {integration.type === "slack" ? "Slack" : "Microsoft Teams"}
                </h4>
                <p className="text-sm text-gray-500">
                  Canal: {integration.channel || "N/A"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleTestIntegration(integration.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Probar
                </button>
                <button
                  onClick={() =>
                    handleToggleStatus(integration.id, integration.isActive)
                  }
                  className={`${
                    integration.isActive ? "bg-yellow-500" : "bg-blue-500"
                  } text-white px-3 py-1 rounded text-sm hover:opacity-80`}>
                  {integration.isActive ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => handleDeleteIntegration(integration.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {integrations.length === 0 && (
            <p className="text-gray-500 text-center">
              No hay integraciones configuradas
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsConfig;
