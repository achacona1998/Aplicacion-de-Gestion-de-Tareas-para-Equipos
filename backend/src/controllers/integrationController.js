const User = require("../models/userModel");
const Team = require("../models/teamModel");
const Integration = require("../models/integrationModel");
const {
  sendSlackNotification,
  sendTeamsNotification,
  formatSlackMessage,
  formatTeamsMessage,
} = require("../utils/notificationUtils");

/**
 * Controlador para manejar integraciones con servicios externos
 */

/**
 * Obtiene todas las integraciones de un equipo
 * @route GET /api/v1/integrations/team/:teamId
 */
exports.getTeamIntegrations = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verificar que el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar que el usuario tiene permisos para ver integraciones
    const isMember = await Team.isTeamMember(teamId, req.user.id);
    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver las integraciones de este equipo",
      });
    }

    // Obtener integraciones
    const integrations = await Integration.getTeamIntegrations(teamId);

    // Para cada integración, obtener sus configuraciones de notificación
    const integrationsWithSettings = await Promise.all(
      integrations.map(async (integration) => {
        const settings = await Integration.getNotificationSettings(
          integration.id
        );
        return {
          ...integration,
          notificationSettings: settings,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: integrationsWithSettings.length,
      integrations: integrationsWithSettings,
    });
  } catch (error) {
    console.error("Error al obtener integraciones:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener integraciones",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Configura la integración con Slack para un equipo
 * @route POST /api/v1/integrations/slack/team/:teamId
 */
exports.configureSlackForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { webhookUrl, channelName, notificationSettings } = req.body;

    // Validar datos de entrada
    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: "La URL del webhook de Slack es obligatoria",
      });
    }

    // Verificar que el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar que el usuario tiene permisos para configurar integraciones
    const isTeamLeader = await Team.isTeamLeader(teamId, req.user.id);
    if (!isTeamLeader && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "No tienes permiso para configurar integraciones para este equipo",
      });
    }

    // Guardar configuración de Slack
    const integrationData = {
      webhookUrl,
      channelName: channelName || "general",
      isActive: true,
    };

    const result = await Integration.saveTeamIntegration(
      teamId,
      "slack",
      integrationData
    );

    // Si se proporcionaron configuraciones de notificación, guardarlas
    if (notificationSettings && Array.isArray(notificationSettings)) {
      await Integration.saveNotificationSettings(
        result.id,
        notificationSettings
      );
    } else {
      // Configuraciones predeterminadas
      const defaultSettings = [
        { eventType: "task_created", isEnabled: true },
        { eventType: "task_assigned", isEnabled: true },
        { eventType: "task_completed", isEnabled: true },
        { eventType: "task_due_soon", isEnabled: true },
        { eventType: "project_created", isEnabled: true },
        { eventType: "project_completed", isEnabled: true },
      ];
      await Integration.saveNotificationSettings(result.id, defaultSettings);
    }

    // Enviar notificación de prueba
    const testMessage = formatSlackMessage({
      title: "✅ Integración con Slack configurada correctamente",
      text: `La integración con Slack ha sido configurada correctamente para el equipo ${team.name}`,
      fields: [
        {
          title: "Equipo",
          value: team.name,
        },
        {
          title: "Configurado por",
          value: req.user.username,
        },
      ],
    });

    try {
      await sendSlackNotification(webhookUrl, testMessage);
    } catch (error) {
      console.warn(
        "No se pudo enviar la notificación de prueba a Slack:",
        error.message
      );
      // No interrumpimos el flujo si la notificación de prueba falla
    }

    res.status(200).json({
      success: true,
      message: "Integración con Slack configurada correctamente",
      data: {
        teamId,
        integration: {
          id: result.id,
          type: "slack",
          webhookUrl,
          channelName: channelName || "general",
        },
      },
    });
  } catch (error) {
    console.error("Error al configurar integración con Slack:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al configurar integración con Slack",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Configura la integración con Microsoft Teams para un equipo
 * @route POST /api/v1/integrations/teams/team/:teamId
 */
exports.configureTeamsForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { webhookUrl, channelName, notificationSettings } = req.body;

    // Validar datos de entrada
    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: "La URL del webhook de Microsoft Teams es obligatoria",
      });
    }

    // Verificar que el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar que el usuario tiene permisos para configurar integraciones
    const isTeamLeader = await Team.isTeamLeader(teamId, req.user.id);
    if (!isTeamLeader && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "No tienes permiso para configurar integraciones para este equipo",
      });
    }

    // Guardar configuración de Microsoft Teams
    const integrationData = {
      webhookUrl,
      channelName: channelName || "general",
      isActive: true,
    };

    const result = await Integration.saveTeamIntegration(
      teamId,
      "teams",
      integrationData
    );

    // Si se proporcionaron configuraciones de notificación, guardarlas
    if (notificationSettings && Array.isArray(notificationSettings)) {
      await Integration.saveNotificationSettings(
        result.id,
        notificationSettings
      );
    } else {
      // Configuraciones predeterminadas
      const defaultSettings = [
        { eventType: "task_created", isEnabled: true },
        { eventType: "task_assigned", isEnabled: true },
        { eventType: "task_completed", isEnabled: true },
        { eventType: "task_due_soon", isEnabled: true },
        { eventType: "project_created", isEnabled: true },
        { eventType: "project_completed", isEnabled: true },
      ];
      await Integration.saveNotificationSettings(result.id, defaultSettings);
    }

    // Enviar notificación de prueba
    const testMessage = formatTeamsMessage({
      title: "✅ Integración con Microsoft Teams configurada correctamente",
      text: `La integración con Microsoft Teams ha sido configurada correctamente para el equipo ${team.name}`,
      fields: [
        {
          title: "Equipo",
          value: team.name,
        },
        {
          title: "Configurado por",
          value: req.user.username,
        },
      ],
    });

    try {
      await sendTeamsNotification(webhookUrl, testMessage);
    } catch (error) {
      console.warn(
        "No se pudo enviar la notificación de prueba a Microsoft Teams:",
        error.message
      );
      // No interrumpimos el flujo si la notificación de prueba falla
    }

    res.status(200).json({
      success: true,
      message: "Integración con Microsoft Teams configurada correctamente",
      data: {
        teamId,
        integration: {
          id: result.id,
          type: "teams",
          webhookUrl,
          channelName: channelName || "general",
        },
      },
    });
  } catch (error) {
    console.error(
      "Error al configurar integración con Microsoft Teams:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al configurar integración con Microsoft Teams",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Prueba una integración enviando un mensaje de prueba
 * @route POST /api/v1/integrations/:integrationId/test
 */
exports.testIntegration = async (req, res) => {
  try {
    const { integrationId } = req.params;

    // Obtener la integración
    const integration = await Integration.getIntegrationById(integrationId);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "Integración no encontrada",
      });
    }

    // Verificar que el usuario tiene permisos
    const team = await Team.getTeamById(integration.team_id);
    const isTeamLeader = await Team.isTeamLeader(
      integration.team_id,
      req.user.id
    );
    if (!isTeamLeader && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para probar esta integración",
      });
    }

    // Preparar mensaje de prueba
    let message;
    let result;

    if (integration.integration_type === "slack") {
      message = formatSlackMessage({
        title: "🧪 Prueba de integración con Slack",
        text: `Esta es una prueba de la integración con Slack para el equipo ${team.name}`,
        fields: [
          {
            title: "Equipo",
            value: team.name,
          },
          {
            title: "Probado por",
            value: req.user.username,
          },
          {
            title: "Fecha y hora",
            value: new Date().toLocaleString(),
          },
        ],
      });

      result = await sendSlackNotification(integration.webhook_url, message);
    } else if (integration.integration_type === "teams") {
      message = formatTeamsMessage({
        title: "🧪 Prueba de integración con Microsoft Teams",
        text: `Esta es una prueba de la integración con Microsoft Teams para el equipo ${team.name}`,
        fields: [
          {
            title: "Equipo",
            value: team.name,
          },
          {
            title: "Probado por",
            value: req.user.username,
          },
          {
            title: "Fecha y hora",
            value: new Date().toLocaleString(),
          },
        ],
      });

      result = await sendTeamsNotification(integration.webhook_url, message);
    }

    // Registrar la notificación en el historial
    await Integration.logNotification({
      integrationId: integration.id,
      eventType: "test",
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: `Prueba de integración con ${
        integration.integration_type === "slack" ? "Slack" : "Microsoft Teams"
      } enviada correctamente`,
      data: result,
    });
  } catch (error) {
    console.error("Error al probar integración:", error.message);

    // Intentar registrar el error en el historial si tenemos el ID de integración
    try {
      if (req.params.integrationId) {
        await Integration.logNotification({
          integrationId: req.params.integrationId,
          eventType: "test",
          status: "failed",
          errorMessage: error.message,
        });
      }
    } catch (logError) {
      console.error(
        "Error al registrar fallo de notificación:",
        logError.message
      );
    }

    res.status(500).json({
      success: false,
      message: "Error al probar integración",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Activa o desactiva una integración
 * @route PATCH /api/v1/integrations/:integrationId/status
 */
exports.updateIntegrationStatus = async (req, res) => {
  try {
    const { integrationId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "El estado de activación debe ser un valor booleano",
      });
    }

    // Obtener la integración
    const integration = await Integration.getIntegrationById(integrationId);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "Integración no encontrada",
      });
    }

    // Verificar que el usuario tiene permisos
    const isTeamLeader = await Team.isTeamLeader(
      integration.team_id,
      req.user.id
    );
    if (!isTeamLeader && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para modificar esta integración",
      });
    }

    // Actualizar estado
    await Integration.updateIntegrationStatus(integrationId, isActive);

    res.status(200).json({
      success: true,
      message: `Integración ${
        isActive ? "activada" : "desactivada"
      } correctamente`,
      data: {
        id: integrationId,
        isActive,
      },
    });
  } catch (error) {
    console.error("Error al actualizar estado de integración:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al actualizar estado de integración",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Elimina una integración
 * @route DELETE /api/v1/integrations/:integrationId
 */
exports.deleteIntegration = async (req, res) => {
  try {
    const { integrationId } = req.params;

    // Obtener la integración
    const integration = await Integration.getIntegrationById(integrationId);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "Integración no encontrada",
      });
    }

    // Verificar que el usuario tiene permisos
    const isTeamLeader = await Team.isTeamLeader(
      integration.team_id,
      req.user.id
    );
    if (!isTeamLeader && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta integración",
      });
    }

    // Eliminar integración
    await Integration.deleteIntegration(integrationId);

    res.status(200).json({
      success: true,
      message: "Integración eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar integración:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar integración",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
