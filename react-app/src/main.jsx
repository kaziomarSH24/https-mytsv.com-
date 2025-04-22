import "./index.css";
import "animate.css";
import App from "./App";
import axios from "axios";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { PrimaryProvider } from "./context/PrimaryContext";

let url = window.location.origin + "/api";
if (import.meta.env.DEV) {
    url = "http://127.0.0.1:8000";
}

axios.defaults.baseURL = url;
// axios.defaults.baseURL = "http://127.0.0.1:8000/api/";
axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <PrimaryProvider>
        <App />
        <ToastContainer />
    </PrimaryProvider>
);
