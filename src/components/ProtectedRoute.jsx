import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';

export default function ProtectedRoute({ children }) {
  const { user } = useFirebase();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
