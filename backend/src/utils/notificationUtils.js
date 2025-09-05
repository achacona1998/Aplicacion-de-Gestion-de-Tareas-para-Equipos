/**
 * Utilidades para enviar notificaciones a servicios externos como Slack y Microsoft Teams
 */

const https = require("https");

/**
 * Envía una notificación a un canal de Slack
 * @param {string} webhookUrl - URL del webhook de Slack
 * @param {Object} message - Mensaje a enviar
 * @returns {Promise<Object>} - Respuesta de la API de Slack
 */
exports.sendSlackNotification = async (webhookUrl, message) => {
  try {
    // Validar la URL del webhook
    if (!webhookUrl || !webhookUrl.startsWith("https://hooks.slack.com/")) {
      throw new Error("URL de webhook de Slack inválida");
    }

    // Preparar el cuerpo de la solicitud
    const payload = JSON.stringify(message);

    // Configurar opciones para la solicitud HTTPS
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    // Enviar la solicitud a Slack
    return new Promise((resolve, reject) => {
      const req = https.request(webhookUrl, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, statusCode: res.statusCode, data });
          } else {
            reject(
              new Error(
                `Error al enviar notificación a Slack: ${res.statusCode} ${data}`
              )
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error("Error al enviar notificación a Slack:", error.message);
    throw error;
  }
};

/**
 * Envía una notificación a un canal de Microsoft Teams
 * @param {string} webhookUrl - URL del webhook de Microsoft Teams
 * @param {Object} message - Mensaje a enviar
 * @returns {Promise<Object>} - Respuesta de la API de Microsoft Teams
 */
exports.sendTeamsNotification = async (webhookUrl, message) => {
  try {
    // Validar la URL del webhook
    if (!webhookUrl || !webhookUrl.startsWith("https://")) {
      throw new Error("URL de webhook de Microsoft Teams inválida");
    }

    // Preparar el cuerpo de la solicitud
    const payload = JSON.stringify(message);

    // Configurar opciones para la solicitud HTTPS
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    // Enviar la solicitud a Microsoft Teams
    return new Promise((resolve, reject) => {
      const req = https.request(webhookUrl, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, statusCode: res.statusCode, data });
          } else {
            reject(
              new Error(
                `Error al enviar notificación a Microsoft Teams: ${res.statusCode} ${data}`
              )
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error(
      "Error al enviar notificación a Microsoft Teams:",
      error.message
    );
    throw error;
  }
};

/**
 * Formatea un mensaje para Slack
 * @param {Object} data - Datos para el mensaje
 * @returns {Object} - Mensaje formateado para Slack
 */
exports.formatSlackMessage = (data) => {
  const { title, text, fields = [], color = "#36a64f" } = data;

  return {
    attachments: [
      {
        color,
        title,
        text,
        fields: fields.map((field) => ({
          title: field.title,
          value: field.value,
          short: field.short || false,
        })),
        footer: "Gestión de Tareas para Equipos",
        footer_icon:
          "https://platform.slack-edge.com/img/default_application_icon.png",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
};

/**
 * Formatea un mensaje para Microsoft Teams
 * @param {Object} data - Datos para el mensaje
 * @returns {Object} - Mensaje formateado para Microsoft Teams
 */
exports.formatTeamsMessage = (data) => {
  const { title, text, fields = [], color = "#36a64f" } = data;

  return {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: color.replace("#", ""),
    summary: title,
    sections: [
      {
        activityTitle: title,
        activitySubtitle: "Gestión de Tareas para Equipos",
        activityImage: "https://adaptivecards.io/content/adaptive-card-50.png",
        text: text,
        facts: fields.map((field) => ({
          name: field.title,
          value: field.value,
        })),
      },
    ],
  };
};
