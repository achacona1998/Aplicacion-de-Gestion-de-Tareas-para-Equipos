import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Importar componente de ruta protegida
import ProtectedRoute from "./ProtectedRoutes";
import Auth from "../pages/auth/Auth";
import StartPage from "../pages/StartPage";
import Dashboard from "../pages/Dashboard";
import BoardsPage from "../pages/Boards/BoardsPage";
import BoardPage from "../pages/Boards/BoardPage";
import TaskList from "../pages/Tareas/TaskList";
import TaskDetail from "../pages/Tareas/TaskDetail";
import TaskFormPage from "../pages/Tareas/TaskFormPage";
import KanbanBoard from "../pages/KanbanBoard";
import GanttChart from "../pages/GanttChart";
import TeamPage from "../pages/TeamPage";
import IntegrationsPage from "../pages/IntegrationsPage";
import ProfilePage from "../pages/auth/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationsPage from "../pages/auth/NotificationsPage";
import MessagesPage from "../pages/MessagesPage";
import CalendarPage from "../pages/CalendarPage";

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes location={location} key={location.pathname}>
      {/* Rutas públicas */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<StartPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas de tableros */}
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards/:boardId"
        element={
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas de tareas */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <TaskFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <ProtectedRoute>
            <TaskFormPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas de visualización */}
      <Route
        path="/kanban"
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gantt"
        element={
          <ProtectedRoute>
            <GanttChart />
          </ProtectedRoute>
        }
      />

      {/* Rutas de equipo */}
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:teamId/integrations"
        element={
          <ProtectedRoute>
            <IntegrationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl font-bold">Proyectos (En desarrollo)</h1>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Rutas de usuario */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Otras rutas */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
