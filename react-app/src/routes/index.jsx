import { createBrowserRouter } from "react-router-dom";
import NormalLayout from "../components/Layouts/NormalLayout";
import UserLayout from "../components/Layouts/UserLayout";
import AdminLayout from "../components/Layouts/AdminLayout";
import { normalRoutes } from "./normalRoutes";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";

const router = createBrowserRouter([
    {
        element: <NormalLayout />,
        children: normalRoutes,
    },
    {
        path: "/User",
        element: <UserLayout />,
        children: userRoutes,
    },
    {
        path: "/Admin",
        element: <AdminLayout />,
        children: adminRoutes,
    },
    {
        path: "/Auth",
        children: authRoutes,
    },
]);

export default router;