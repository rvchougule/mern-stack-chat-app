import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "../components/ProtectedRoute";
import MessagePage from "../pages/MessagePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <Home />,
            children: [
              {
                path: ":userId",
                element: <MessagePage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
