-- Tabla para almacenar configuraciones de integraciones de equipos
CREATE TABLE IF NOT EXISTS team_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    integration_type ENUM('slack', 'teams') NOT NULL,
    webhook_url VARCHAR(255) NOT NULL,
    channel_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_integration (team_id, integration_type)
);
-- Tabla para almacenar preferencias de notificaciones por integración
CREATE TABLE IF NOT EXISTS integration_notification_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    integration_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES team_integrations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_notification_setting (integration_id, event_type)
);
-- Tabla para almacenar historial de notificaciones enviadas
CREATE TABLE IF NOT EXISTS integration_notification_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    integration_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(50),
    status ENUM('success', 'failed') NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES team_integrations(id) ON DELETE CASCADE
);