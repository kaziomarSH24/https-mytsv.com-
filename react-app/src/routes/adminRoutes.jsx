import Dashboard from "../pages/Dashboard/Admin/Dashboard";
import UsersList from "../pages/Dashboard/Admin/Users/UsersList";
import UsersForm from "../pages/Dashboard/Admin/Users/UsersForm";
import SettingsAdmin from "../pages/Dashboard/Admin/Settings";
import VideosList from "../pages/Dashboard/Admin/Videos/VideosList";
import CategoriesForm from "../pages/Dashboard/Admin/Categories/CategoriesForm";
import CategoriesList from "../pages/Dashboard/Admin/Categories/CategoriesList";
import VideosForm from "../pages/Dashboard/Admin/Videos/VideosForm";
import BlogsList from "../pages/Dashboard/Admin/Blogs/BlogsList";
import BlogsForm from "../pages/Dashboard/Admin/Blogs/BlogsForm";

export const adminRoutes = [
    {
        path: "",
        element: <Dashboard />,
    },
    {
        path: "Users",
        children: [
            {
                path: "",
                element: <UsersList />,
            },
            {
                path: ":id",
                element: <UsersForm />,
            },
        ],
    },
    {
        path: "Categories",
        children: [
            {
                path: "",
                element: <CategoriesList />,
            },
            {
                path: ":id",
                element: <CategoriesForm />,
            },
        ],
    },
    {
        path: "Videos",
        children: [
            {
                path: "",
                element: <VideosList />,
            },
            {
                path: ":id",
                element: <VideosForm />,
            },
        ],
    },
    {
        path: "Blogs",
        children: [
            {
                path: "",
                element: <BlogsList />,
            },
            {
                path: ":id",
                element: <BlogsForm />,
            },
        ],
    },
    {
        path: "Settings",
        element: <SettingsAdmin />,
    },
];