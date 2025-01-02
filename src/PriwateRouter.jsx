import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the children (outlet for nested routes)
  return <Outlet />;
};

export default PrivateRoute;
