import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAppSelector(selectAuth);

  if (isAuthenticated) {
    return <Navigate to="/chats" replace />;
  }

  return children;
};

export default PublicRoute;
