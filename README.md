# Aplicación de Gestión de Tareas para Equipos

## Descripción

Esta aplicación es una herramienta completa de gestión de tareas diseñada para equipos, que permite organizar proyectos, asignar tareas, realizar seguimiento del progreso y colaborar eficientemente. Inspirada en herramientas como Trello, Asana y Jira, esta aplicación combina las mejores características de gestión de proyectos en una interfaz intuitiva y fácil de usar.

## Características Principales

- **Dashboard Interactivo**: Visualización general del estado de proyectos y tareas pendientes.
- **Gestión de Tareas**: Creación, asignación, seguimiento y actualización de tareas.
- **Múltiples Vistas de Proyecto**: Kanban (tableros), lista de tareas y vista de calendario.
- **Gestión de Equipos**: Creación de equipos, asignación de miembros y roles.
- **Notificaciones**: Sistema de alertas para fechas límite y actualizaciones de tareas.
- **Reportes y Estadísticas**: Visualización del rendimiento del equipo y progreso del proyecto.
- **Integración con Herramientas**: Conexión con otras plataformas y servicios.
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos.

## Tecnologías Utilizadas

### Frontend

- **React**: Biblioteca JavaScript para construir interfaces de usuario.
- **React Router**: Navegación entre componentes.
- **Tailwind CSS**: Framework de CSS para diseño rápido y responsivo.
- **Chart.js y Recharts**: Visualización de datos y estadísticas.
- **Framer Motion**: Animaciones fluidas en la interfaz.
- **React Beautiful DnD**: Funcionalidad de arrastrar y soltar para tableros Kanban.
- **React Calendar**: Visualización de tareas en formato calendario.

### Backend

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Express**: Framework web para Node.js.
- **MySQL**: Base de datos relacional para almacenamiento de datos.
- **JWT (JSON Web Tokens)**: Autenticación segura de usuarios.
- **Bcrypt**: Encriptación de contraseñas.
- **Helmet**: Seguridad para aplicaciones Express.
- **Cors**: Manejo de solicitudes de origen cruzado.
- **Dotenv**: Gestión de variables de entorno.

## Estructura del Proyecto

### Frontend

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   ├── auth/
│   │   ├── board/
│   │   ├── calendar/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── gantt/
│   │   ├── layout/
│   │   ├── list/
│   │   ├── modals/
│   │   ├── notifications/
│   │   ├── project/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── sidebar/
│   │   ├── task/
│   │   └── team/
│   ├── constants/
│   ├── hooks/
│   ├── pages/
│   │   ├── Boards/
│   │   ├── Tareas/
│   │   └── auth/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

### Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── SQL/
│   ├── controllers/
│   │   ├── boardController.js
│   │   ├── commentController.js
│   │   ├── ganttController.js
│   │   ├── integrationController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── projectController.js
│   │   ├── reportController.js
│   │   ├── taskController.js
│   │   ├── teamController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Board.js
│   │   ├── Comment.js
│   │   ├── Gantt.js
│   │   ├── Integration.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Project.js
│   │   ├── Report.js
│   │   ├── Task.js
│   │   ├── Team.js
│   │   └── User.js
│   ├── routes/
│   │   ├── boardRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── ganttRoutes.js
│   │   ├── integrationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── teamRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   └── validators.js
│   └── app.js
└── package.json
```

## Instalación y Configuración

### Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)

### Configuración del Entorno

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/aplicacion-gestion-tareas.git
cd aplicacion-gestion-tareas
```

2. **Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `backend` con la siguiente información:

```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=gestion_tareas
JWT_SECRET=tu_clave_secreta
PORT=5000
```

3. **Configurar la base de datos**

- Crea una base de datos MySQL llamada `gestion_tareas`
- Ejecuta los scripts SQL ubicados en `backend/src/config/SQL/`

### Instalación de Dependencias

1. **Backend**

```bash
cd backend
npm install
```

2. **Frontend**

```bash
cd frontend
npm install
```

### Iniciar los Servidores

1. **Backend**

```bash
cd backend
npm run dev
```

2. **Frontend**

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y la API en `http://localhost:5000`.

## Uso

1. Regístrate o inicia sesión en la aplicación.
2. Crea un nuevo proyecto o únete a uno existente.
3. Crea tableros para organizar las tareas del proyecto.
4. Añade listas y tarjetas a los tableros para gestionar las tareas.
5. Asigna tareas a los miembros del equipo y establece fechas límite.
6. Utiliza las diferentes vistas (Kanban, lista, calendario) según tus necesidades.
7. Monitorea el progreso a través del dashboard y los reportes.

## Modelo de Datos

![Diagrama Entidad-Relación](./DER.png)

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request


## Contacto

Para cualquier consulta o sugerencia, no dudes en contactar:

- **Email**: achacona1998@gmail.com
- **GitHub**: [achacona1998](https://github.com/achacona1998)
- **LinkedIn**: [Ariel Chacon Artola](https://www.linkedin.com/in/ariel-chacon-artola-7a00bb2b4/)
