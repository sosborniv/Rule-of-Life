import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Initializing…</div>;
  if (!user) return <Navigate to="/onboarding/sign-in" replace />;
  return children;
}