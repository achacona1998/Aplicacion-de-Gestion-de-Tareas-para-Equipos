const { pool } = require("../config/database");

class Integration {
  /**
   * Obtiene todas las integraciones de un equipo
   * @param {number} teamId - ID del equipo
   * @returns {Promise<Array>} - Lista de integraciones
   */
  static async getTeamIntegrations(teamId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT * FROM team_integrations
        WHERE team_id = ?
        ORDER BY created_at DESC
      `,
        [teamId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener integraciones del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Obtiene una integración por ID
   * @param {number} integrationId - ID de la integración
   * @returns {Promise<Object>} - Datos de la integración
   */
  static async getIntegrationById(integrationId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM team_integrations WHERE id = ?",
        [integrationId]
      );
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Guarda una nueva integración o actualiza una existente
   * @param {number} teamId - ID del equipo
   * @param {string} integrationType - Tipo de integración ('slack' o 'teams')
   * @param {Object} data - Datos de la integración
   * @returns {Promise<Object>} - Resultado de la operación
   */
  static async saveTeamIntegration(teamId, integrationType, data) {
    const { webhookUrl, channelName, isActive } = data;

    try {
      // Verificar si ya existe una integración de este tipo para este equipo
      const [existing] = await pool.query(
        `
        SELECT id FROM team_integrations
        WHERE team_id = ? AND integration_type = ?
      `,
        [teamId, integrationType]
      );

      let integrationId;

      if (existing.length > 0) {
        // Actualizar integración existente
        integrationId = existing[0].id;
        await pool.query(
          `
          UPDATE team_integrations
          SET webhook_url = ?, channel_name = ?, is_active = ?, updated_at = NOW()
          WHERE id = ?
        `,
          [webhookUrl, channelName, isActive ? 1 : 0, integrationId]
        );
      } else {
        // Crear nueva integración
        const [result] = await pool.query(
          `
          INSERT INTO team_integrations
          (team_id, integration_type, webhook_url, channel_name, is_active)
          VALUES (?, ?, ?, ?, ?)
        `,
          [teamId, integrationType, webhookUrl, channelName, isActive ? 1 : 0]
        );
        integrationId = result.insertId;
      }

      return { id: integrationId, teamId, integrationType };
    } catch (error) {
      console.error(
        `Error al guardar integración para el equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Obtiene las configuraciones de notificación de una integración
   * @param {number} integrationId - ID de la integración
   * @returns {Promise<Array>} - Lista de configuraciones
   */
  static async getNotificationSettings(integrationId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT * FROM integration_notification_settings
        WHERE integration_id = ?
      `,
        [integrationId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener configuraciones de notificación para integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Guarda configuraciones de notificación para una integración
   * @param {number} integrationId - ID de la integración
   * @param {Array} settings - Lista de configuraciones
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  static async saveNotificationSettings(integrationId, settings) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Eliminar configuraciones existentes
      await connection.query(
        "DELETE FROM integration_notification_settings WHERE integration_id = ?",
        [integrationId]
      );

      // Insertar nuevas configuraciones
      for (const setting of settings) {
        await connection.query(
          `
          INSERT INTO integration_notification_settings
          (integration_id, event_type, is_enabled)
          VALUES (?, ?, ?)
        `,
          [integrationId, setting.eventType, setting.isEnabled ? 1 : 0]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(
        `Error al guardar configuraciones de notificación para integración ${integrationId}:`,
        error.message
      );
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Actualiza el estado de una integración
   * @param {number} integrationId - ID de la integración
   * @param {boolean} isActive - Estado de activación
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  static async updateIntegrationStatus(integrationId, isActive) {
    try {
      await pool.query(
        "UPDATE team_integrations SET is_active = ? WHERE id = ?",
        [isActive ? 1 : 0, integrationId]
      );
      return true;
    } catch (error) {
      console.error(
        `Error al actualizar estado de integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Elimina una integración
   * @param {number} integrationId - ID de la integración
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  static async deleteIntegration(integrationId) {
    try {
      await pool.query("DELETE FROM team_integrations WHERE id = ?", [
        integrationId,
      ]);
      return true;
    } catch (error) {
      console.error(
        `Error al eliminar integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Registra una notificación enviada
   * @param {Object} data - Datos de la notificación
   * @returns {Promise<number>} - ID del registro
   */
  static async logNotification(data) {
    const {
      integrationId,
      eventType,
      status,
      errorMessage,
      referenceId,
      referenceType,
    } = data;

    try {
      const [result] = await pool.query(
        `
        INSERT INTO integration_notification_history
        (integration_id, event_type, reference_id, reference_type, status, error_message)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          integrationId,
          eventType,
          referenceId || null,
          referenceType || null,
          status,
          errorMessage || null,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error(
        `Error al registrar notificación para integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Obtiene el historial de notificaciones de una integración
   * @param {number} integrationId - ID de la integración
   * @param {number} limit - Límite de registros
   * @returns {Promise<Array>} - Lista de notificaciones
   */
  static async getNotificationHistory(integrationId, limit = 50) {
    try {
      const [rows] = await pool.query(
        `
        SELECT * FROM integration_notification_history
        WHERE integration_id = ?
        ORDER BY sent_at DESC
        LIMIT ?
      `,
        [integrationId, limit]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener historial de notificaciones para integración ${integrationId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = Integration;
