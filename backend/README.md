# API de Gestión de Tareas para Equipos

API RESTful para la gestión de tareas en equipos de trabajo, especialmente orientada a equipos remotos.

## Características

- Gestión de usuarios y autenticación
- Creación y asignación de tareas con responsables, fechas límite y prioridades
- Organización de tareas en proyectos
- Gestión de equipos de trabajo
- Notificaciones y alertas para fechas límite
- Tableros Kanban para visualización de flujo de trabajo
- Diagramas de Gantt para planificación temporal
- Integración con Slack y Microsoft Teams
- Reportes de productividad por usuario y proyecto

## Requisitos

- Node.js (v14 o superior)
- MySQL (v8 o superior)

## Configuración

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en el archivo `.env`:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=task_management_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (for authentication)
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=1d

# App Configuration
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:5173
```

4. Crea la base de datos y las tablas necesarias:

```bash
# Conéctate a MySQL
mysql -u root -p

# Ejecuta el script SQL
source src/config/database.sql
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## Estructura del Proyecto

```
/backend
  /src
    /config       # Configuración de la aplicación y base de datos
    /controllers  # Controladores para manejar la lógica de negocio
    /models       # Modelos para interactuar con la base de datos
    /routes       # Rutas de la API
    /middlewares  # Middlewares personalizados
    /utils        # Utilidades y funciones auxiliares
    app.js        # Configuración principal de Express
  index.js        # Punto de entrada de la aplicación
  .env            # Variables de entorno
  package.json    # Dependencias y scripts
```

## Endpoints de la API

### Usuarios

- `POST /api/v1/users/register` - Registrar un nuevo usuario
- `POST /api/v1/users/login` - Iniciar sesión
- `GET /api/v1/users/profile` - Obtener perfil del usuario autenticado
- `PUT /api/v1/users/profile` - Actualizar perfil del usuario autenticado
- `PUT /api/v1/users/change-password` - Cambiar contraseña
- `GET /api/v1/users` - Obtener todos los usuarios (admin)
- `GET /api/v1/users/:id` - Obtener usuario por ID (admin)
- `PUT /api/v1/users/:id` - Actualizar usuario por ID (admin)
- `DELETE /api/v1/users/:id` - Eliminar usuario por ID (admin)

### Tareas

- `GET /api/v1/tasks` - Obtener todas las tareas
- `GET /api/v1/tasks/my-tasks` - Obtener tareas asignadas al usuario actual
- `GET /api/v1/tasks/project/:projectId` - Obtener tareas por proyecto
- `GET /api/v1/tasks/:id` - Obtener una tarea por ID
- `POST /api/v1/tasks` - Crear una nueva tarea
- `PUT /api/v1/tasks/:id` - Actualizar una tarea
- `PATCH /api/v1/tasks/:id/status` - Actualizar el estado de una tarea
- `DELETE /api/v1/tasks/:id` - Eliminar una tarea

### Proyectos

- `GET /api/v1/projects` - Obtener todos los proyectos
- `GET /api/v1/projects/my-projects` - Obtener proyectos del usuario actual
- `GET /api/v1/projects/team/:teamId` - Obtener proyectos por equipo
- `GET /api/v1/projects/:id` - Obtener un proyecto por ID
- `POST /api/v1/projects` - Crear un nuevo proyecto
- `PUT /api/v1/projects/:id` - Actualizar un proyecto
- `DELETE /api/v1/projects/:id` - Eliminar un proyecto

### Equipos

- `GET /api/v1/teams` - Obtener todos los equipos
- `GET /api/v1/teams/:id` - Obtener un equipo por ID
- `GET /api/v1/teams/:id/members` - Obtener miembros de un equipo
- `POST /api/v1/teams` - Crear un nuevo equipo
- `PUT /api/v1/teams/:id` - Actualizar un equipo
- `DELETE /api/v1/teams/:id` - Eliminar un equipo
- `POST /api/v1/teams/:id/members` - Agregar miembro a un equipo
- `DELETE /api/v1/teams/:id/members/:userId` - Eliminar miembro de un equipo

### Kanban

- `GET /api/v1/kanban` - Obtener tablero Kanban del usuario
- `GET /api/v1/kanban/project/:projectId` - Obtener tablero Kanban de un proyecto
- `PATCH /api/v1/kanban/task/:taskId/move` - Mover una tarea entre columnas

### Gantt

- `GET /api/v1/gantt/projects` - Obtener datos de Gantt para todos los proyectos
- `GET /api/v1/gantt/project/:projectId` - Obtener datos de Gantt para un proyecto

### Integraciones

- `GET /api/v1/integrations/team/:teamId` - Obtener todas las integraciones de un equipo
- `POST /api/v1/integrations/slack/team/:teamId` - Configurar integración con Slack
- `POST /api/v1/integrations/teams/team/:teamId` - Configurar integración con Microsoft Teams
- `POST /api/v1/integrations/:integrationId/test` - Probar una integración
- `PATCH /api/v1/integrations/:integrationId/status` - Activar/desactivar una integración
- `DELETE /api/v1/integrations/:integrationId` - Eliminar una integración

### Reportes

- `GET /api/v1/reports/user/:userId` - Reporte de productividad por usuario
- `GET /api/v1/reports/project/:projectId` - Reporte de productividad por proyecto

## Funcionalidades Implementadas

### Autenticación con JWT

- Tokens JWT generados al registrarse o iniciar sesión
- Middleware de protección para rutas privadas
- Verificación de roles para acciones específicas
- Tokens con tiempo de expiración configurable

### Gestión de Usuarios

- Registro, inicio de sesión y gestión de perfil
- Cambio de contraseña
- Administración de usuarios (solo admin)

### Gestión de Tareas

- Creación, edición, eliminación y consulta de tareas
- Asignación de responsables, fechas límite y prioridades
- Actualización de estado de tareas

### Gestión de Proyectos

- Creación, edición, eliminación y consulta de proyectos
- Asociación de tareas a proyectos
- Visualización de proyectos por equipo o usuario

### Gestión de Equipos

- Creación, edición, eliminación y consulta de equipos
- Gestión de miembros de equipos

### Tableros Kanban

- Visualización de tareas en formato Kanban
- Movimiento de tareas entre columnas
- Filtrado de tableros por proyecto

### Diagramas de Gantt

- Visualización de fechas de inicio y fin de proyectos
- Visualización de tareas con sus plazos
- Cálculo de progreso de proyectos y tareas

### Integración con Slack y Microsoft Teams

- Notificaciones automáticas sobre eventos importantes
- Soporte para creación, asignación y finalización de tareas y proyectos
- Notificaciones de tareas próximas a vencer

### Reportes de Productividad

- Reportes de productividad por usuario
- Reportes de productividad por proyecto

## Eventos Soportados en Integraciones

- Creación de tareas
- Asignación de tareas
- Finalización de tareas
- Tareas próximas a vencer
- Creación de proyectos
- Finalización de proyectos
