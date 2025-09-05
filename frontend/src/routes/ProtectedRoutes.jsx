import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';
import Layout from '../components/Layout';

/**
 * Componente que protege rutas que requieren autenticación
 * Redirecciona a la página de autenticación si el usuario no está autenticado
 */
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/auth" replace />
  );
};

export default ProtectedRoute;
