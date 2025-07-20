import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Cuando este componente se renderiza, la carga inicial ya ha terminado.
  // La decisión es simple: ¿hay usuario o no?
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;