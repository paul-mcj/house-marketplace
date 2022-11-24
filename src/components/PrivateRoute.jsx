// react router dom
import { Navigate, Outlet } from "react-router-dom";

// components
import Spinner from "./Spinner";

// hooks
import useAuthStatus from "../hooks/use-authStatus";

const PrivateRoute = () => {
     // custom hook initialization
     const { loggedIn, checkingStatus } = useAuthStatus();

     if (checkingStatus) {
          return <Spinner />;
     }

     return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
