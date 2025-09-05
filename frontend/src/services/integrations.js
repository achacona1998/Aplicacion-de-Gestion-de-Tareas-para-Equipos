import api from "./api";

// Obtener todas las integraciones de un equipo
export const getTeamIntegrations = async (teamId) => {
  const response = await api.get(`/integrations/team/${teamId}`);
  return response.data;
};

// Configurar integración con Slack
export const configureSlackIntegration = async (teamId, slackConfig) => {
  const response = await api.post(
    `/integrations/slack/team/${teamId}`,
    slackConfig
  );
  return response.data;
};

// Configurar integración con Microsoft Teams
export const configureTeamsIntegration = async (teamId, teamsConfig) => {
  const response = await api.post(
    `/integrations/teams/team/${teamId}`,
    teamsConfig
  );
  return response.data;
};

// Probar una integración
export const testIntegration = async (integrationId) => {
  const response = await api.post(`/integrations/${integrationId}/test`);
  return response.data;
};

// Activar/desactivar una integración
export const toggleIntegrationStatus = async (integrationId, isActive) => {
  const response = await api.patch(`/integrations/${integrationId}/status`, {
    isActive,
  });
  return response.data;
};

// Eliminar una integración
export const deleteIntegration = async (integrationId) => {
  const response = await api.delete(`/integrations/${integrationId}`);
  return response.data;
};
