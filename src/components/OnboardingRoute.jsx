import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';

export default function OnboardingRoute({ children }) {
  const { user } = useFirebase();

  if (user && !user.onboardingComplete) {
    return <Navigate to="/interests" />;
  }

  return children;
}
