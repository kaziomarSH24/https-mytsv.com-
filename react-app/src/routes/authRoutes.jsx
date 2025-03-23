import Signin from "../pages/Auth/Login";
import Signup from "../pages/Auth/Register";

export const authRoutes = [
    {
        path: "Login/:social?",
        element: <Signin />,
    },
    {
        path: "Register",
        element: <Signup />,
    },
];