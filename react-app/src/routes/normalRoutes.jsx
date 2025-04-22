import Home from "../pages/Home";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import Video from "../pages/Video";
import Blogs from "../pages/Blogs/Blogs";
import BlogView from "../pages/Blogs/BlogView";
import ViewDetails from "../components/ViewDetails";
import TermsAndConditions from "../pages/TermsAndConditions";
import AboutUs from "../pages/AboutUs";
import ContactForm from "../pages/ContactForm";
import FAQPage from "../pages/FAQPage";
export const normalRoutes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/view-all/:prms",
        element: <ViewDetails />,
    },
    {
        path: "/Search/:id",
        element: <Search />,
    },
    // {
    //     path: "/Search/:query?",
    //     element: <Search />,
    // },
    {
        path: "/Profile/:id?",
        element: <Profile />,
    },
    {
        path: "/:slug",
        element: <Video />,
    },
    {
        path: "/blogs",
        children: [
            {
                path: "",
                element: <Blogs />,
            },
            {
                path: ":slug",
                element: <BlogView />,
            },
        ],
    },
    {
        path: "/terms-conditions",
        element: <TermsAndConditions />,
    },
    {
        path: "/about-us",
        element: <AboutUs />,
    },
    {
        path: "/contact-us",
        element: <ContactForm />,
    },
    {
        path:"/faq",
        element: <FAQPage/>,
    }
];
