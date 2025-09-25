# Frontend - Aplicación de Gestión de Tareas para Equipos

Frontend desarrollado con React + Vite para la aplicación de gestión de tareas para equipos.

## 🚀 Tecnologías

- **React 19** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento para aplicaciones React
- **Chart.js & Recharts** - Visualización de datos y gráficos
- **Framer Motion** - Animaciones fluidas
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos
- **Jest** - Framework de testing
- **Testing Library** - Utilidades para testing de componentes React

## 📦 Instalación

1. Instalar dependencias:
```bash
pnpm install
```

2. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
```

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Vista previa de la build de producción
pnpm preview
```

### Build
```bash
# Construir para producción
pnpm build
```

### Linting
```bash
# Ejecutar ESLint
pnpm lint
```

### Testing
```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests con coverage
pnpm test:coverage

# Ejecutar solo tests de componentes UI
pnpm test:ui

# Ejecutar solo tests de servicios
pnpm test:services
```

## 🧪 Testing

El proyecto incluye tests de integración para servicios y componentes:

### Tests de Servicios
- **authService**: Tests para autenticación (login, register, logout)
- **taskService**: Tests para gestión de tareas (fetchTasks, calculateTaskStats, filterTasks)
- **teamService**: Tests para gestión de equipos (fetchUserTeam, fetchTeamMembers)

### Cobertura de Tests
Los tests cubren:
- Casos de éxito y error
- Validación de parámetros
- Manejo de respuestas de API
- Estados de carga y error

### Ejecutar Tests Específicos
```bash
# Tests de autenticación
pnpm jest test/services/auth.test.js

# Tests de tareas
pnpm jest test/services/taskService.test.js

# Tests de equipos
pnpm jest test/services/teamService.test.js
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── UI/             # Componentes de interfaz básicos
│   ├── auth/           # Componentes de autenticación
│   └── board/          # Componentes del tablero Kanban
├── pages/              # Páginas de la aplicación
├── services/           # Servicios para comunicación con API
├── hooks/              # Custom hooks de React
├── routes/             # Configuración de rutas
├── styles/             # Estilos globales
└── utils/              # Utilidades y helpers

test/
├── components/         # Tests de componentes
├── services/           # Tests de servicios
└── __mocks__/          # Mocks para testing
```

## 🔧 Configuración

### Variables de Entorno
- `VITE_API_URL`: URL base de la API (por defecto: http://localhost:3000)

### ESLint
El proyecto utiliza ESLint con configuración para React y hooks. Para expandir la configuración de ESLint en aplicaciones de producción, se recomienda usar TypeScript y reglas type-aware.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
