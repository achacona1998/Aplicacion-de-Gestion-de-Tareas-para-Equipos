# Tests - Aplicación de Gestión de Tareas para Equipos

Este directorio contiene todos los tests automatizados para la aplicación de gestión de tareas para equipos, incluyendo tests para el backend (API) y frontend (React).

## 📊 Estado Actual de los Tests

- **Backend**: ✅ 40/40 tests pasando
- **Frontend**: ✅ 24/24 tests pasando
- **Total**: ✅ 64/64 tests pasando

## 🏗️ Estructura del Proyecto

```
test/
├── README.md                    # Este archivo
├── package.json                 # Dependencias de testing
├── babel.config.js             # Configuración de Babel para tests
├── jest.backend.config.js      # Configuración de Jest para backend
├── jest.frontend.config.js     # Configuración de Jest para frontend
├── backend/                    # Tests del backend
│   ├── setup.js               # Configuración global para tests de backend
│   ├── env.setup.js           # Variables de entorno para tests
│   ├── controllers/           # Tests de controladores
│   │   ├── userController.test.js
│   │   ├── taskController.test.js
│   │   └── teamController.test.js
│   └── models/                # Tests de modelos
│       ├── User.test.js
│       ├── Task.test.js
│       └── Team.test.js
├── frontend/                  # Tests del frontend
│   ├── setup.js              # Configuración global para tests de frontend
│   ├── importMetaMock.js     # Mock para import.meta
│   ├── __mocks__/            # Mocks globales
│   │   └── localStorage.js
│   └── services/             # Tests de servicios
│       ├── authService.test.js
│       ├── taskService.test.js
│       └── teamService.test.js
└── coverage/                 # Reportes de cobertura
    ├── backend/
    └── frontend/
```

## 🚀 Comandos de Ejecución

### Ejecutar Todos los Tests

```bash
# Desde el directorio /test
npm test

# O ejecutar backend y frontend por separado
npm run test:backend
npm run test:frontend
```

### Ejecutar Tests Específicos

```bash
# Tests del backend
npx jest --config jest.backend.config.js

# Tests del frontend
npx jest --config jest.frontend.config.js

# Test específico
npx jest --config jest.backend.config.js userController.test.js

# Con patrón de nombre
npx jest --config jest.backend.config.js --testNamePattern="login"
```

### Ejecutar con Cobertura

```bash
# Backend con cobertura
npx jest --config jest.backend.config.js --coverage

# Frontend con cobertura
npx jest --config jest.frontend.config.js --coverage
```

### Modo Watch (Desarrollo)

```bash
# Backend en modo watch
npx jest --config jest.backend.config.js --watch

# Frontend en modo watch
npx jest --config jest.frontend.config.js --watch
```

## 🧪 Tests del Backend

### Controladores Testados

#### UserController (15 tests)
- **POST /users/register**: Registro de usuarios
  - ✅ Registro exitoso
  - ✅ Validación de datos requeridos
  - ✅ Manejo de emails duplicados
  - ✅ Manejo de errores del servidor

- **POST /users/login**: Autenticación
  - ✅ Login exitoso
  - ✅ Credenciales incorrectas
  - ✅ Usuario no encontrado
  - ✅ Manejo de errores del servidor

- **GET /users**: Listar usuarios
  - ✅ Retornar todos los usuarios
  - ✅ Manejo de errores del servidor

- **GET /users/:id**: Obtener usuario por ID
  - ✅ Retornar usuario específico
  - ✅ Usuario no encontrado
  - ✅ ID inválido

- **DELETE /users/:id**: Eliminar usuario
  - ✅ Eliminación exitosa
  - ✅ Usuario no encontrado

#### TaskController (10 tests)
- **CRUD completo de tareas**
- **Validaciones de datos**
- **Manejo de errores**
- **Filtros y búsquedas**

#### TeamController (10 tests)
- **CRUD completo de equipos**
- **Gestión de miembros**
- **Validaciones de permisos**
- **Manejo de errores**

### Modelos Testados (5 tests)

#### User Model
- ✅ Obtener usuario por email
- ✅ Crear nuevo usuario
- ✅ Actualizar usuario
- ✅ Eliminar usuario
- ✅ Manejo de errores

## 🎨 Tests del Frontend

### Servicios Testados

#### AuthService (8 tests)
- ✅ Login exitoso
- ✅ Registro exitoso
- ✅ Logout (limpieza de localStorage)
- ✅ Obtener usuario actual
- ✅ Verificar autenticación
- ✅ Manejo de errores de red
- ✅ Validación de tokens
- ✅ Renovación de tokens

#### TaskService (8 tests)
- ✅ Obtener todas las tareas
- ✅ Crear nueva tarea
- ✅ Actualizar tarea
- ✅ Eliminar tarea
- ✅ Filtrar tareas por estado
- ✅ Buscar tareas
- ✅ Asignar tarea a usuario
- ✅ Manejo de errores de API

#### TeamService (8 tests)
- ✅ Obtener todos los equipos
- ✅ Crear nuevo equipo
- ✅ Actualizar equipo
- ✅ Eliminar equipo
- ✅ Agregar miembro al equipo
- ✅ Remover miembro del equipo
- ✅ Obtener miembros del equipo
- ✅ Manejo de errores de API

## 🔧 Configuración

### Variables de Entorno para Tests

```javascript
// test/backend/env.setup.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_database';
```

### Mocks Configurados

#### Backend
- **Base de datos**: Mock completo de mysql2/promise
- **bcrypt**: Mock para hash y comparación de contraseñas
- **jsonwebtoken**: Mock para generación y verificación de tokens

#### Frontend
- **localStorage**: Mock completo para almacenamiento local
- **fetch**: Mock para llamadas HTTP
- **import.meta**: Mock para variables de entorno de Vite

## 📈 Cobertura de Código

Los tests están configurados para generar reportes de cobertura en las carpetas:
- `test/coverage/backend/`
- `test/coverage/frontend/`

### Umbrales de Cobertura

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 🛠️ Herramientas Utilizadas

- **Jest**: Framework de testing principal
- **Supertest**: Testing de APIs HTTP
- **@testing-library/react**: Testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **babel-jest**: Transpilación de código moderno

## 📝 Convenciones de Testing

### Nomenclatura de Tests
- Usar `describe()` para agrupar tests relacionados
- Usar `it()` o `test()` para casos individuales
- Nombres descriptivos en español
- Formato: "debería [acción esperada] [condición]"

### Estructura de Tests
```javascript
describe('Componente/Función', () => {
  beforeEach(() => {
    // Configuración antes de cada test
  });

  afterEach(() => {
    // Limpieza después de cada test
  });

  describe('Funcionalidad específica', () => {
    it('debería comportarse de cierta manera', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Mocks y Stubs
- Usar mocks para dependencias externas
- Limpiar mocks entre tests
- Verificar llamadas a mocks cuando sea relevante

## 🚨 Solución de Problemas

### Tests Fallando
1. Verificar que las dependencias estén instaladas
2. Comprobar variables de entorno
3. Revisar configuración de mocks
4. Ejecutar tests individualmente para aislar problemas

### Problemas de Configuración
1. Verificar archivos de configuración de Jest
2. Comprobar setup files
3. Revisar babel.config.js

### Problemas de Mocks
1. Verificar que los mocks estén en las carpetas correctas
2. Comprobar que se estén limpiando entre tests
3. Revisar configuración en setup files

## 📚 Recursos Adicionales

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Guía de Testing de React](https://reactjs.org/docs/testing.html)

## 🤝 Contribuir

Para agregar nuevos tests:

1. Seguir la estructura de carpetas existente
2. Usar las convenciones de nomenclatura
3. Incluir tests para casos exitosos y de error
4. Mantener alta cobertura de código
5. Documentar casos de uso complejos

---

**Última actualización**: $(Get-Date -Format "yyyy-MM-dd")
**Estado**: ✅ Todos los tests pasando (64/64)