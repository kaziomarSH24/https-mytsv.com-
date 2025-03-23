import AnalyticsPage from "../pages/Dashboard/AnalyticsPage";
import ProfilePage from "../pages/Dashboard/ProfilePage";
import VideoPage from "../pages/Dashboard/VideoPage";
import VideosPage from "../pages/Dashboard/VideosPage";
import Settings from "../pages/Dashboard/Settings";
import Upload from "../pages/Upload";


export const userRoutes = [
    {
        path: "Analytics",
        element: <AnalyticsPage />,
    },
    {
        path: "Profile/:id?",
        element: <ProfilePage />,
    },
    {
        path: "Videos/:id",
        element: <VideoPage />,
    },
    {
        path: "Videos",
        element: <VideosPage />,
    },
    {
        path: "Settings",
        element: <Settings />,
    },
    {
        path: "Upload",
        element: <Upload />,
    },

];
