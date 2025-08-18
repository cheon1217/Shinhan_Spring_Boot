import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAuth;