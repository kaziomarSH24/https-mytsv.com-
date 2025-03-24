import axios from "axios";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { usePrimary } from "../../context/PrimaryContext";

const Signin = () => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { state, dispatch } = usePrimary();

    useEffect(() => {
        if (state.user) {
            navigate("/");
        }
        if (params?.social) {
            axios.post(`/Auth/Social/${params.social}/Callback${location?.search}`).then((response) => {

                if (response.data?.access_token) {
                    localStorage.setItem("accessToken", response.data.access_token);
                    dispatch({ type: "SET_USER", payload: response.data.access_token });
                    navigate("/");
                } else {
                    toast.error(response.data.message);
                }
            });
        }
    }, [state.user, navigate, params, location, dispatch]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            toast.error("All fields are required!");
        } else {
            try {
                const res = await axios.post("Auth/Login", { email, password });
                localStorage.setItem("accessToken", res.data?.access_token);
                console.log(res.data, "response login page");
                dispatch({ type: "SET_USER", payload: res.data }); 

                if (res.data.status !== "error") {
                    navigate("/");
                } else {
                    toast.error(res?.data?.message);
                }
            } catch (error) {
                toast.error("An error occurred during login.");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
                <Link to="/" className="mb-8">
                    <img src="/assets/logo.webp" alt="Logo" className="w-40 h-auto" />
                </Link>
                <h2 className="text-4xl font-bold text-primary mb-6">Welcome Back</h2>
                <div className="flex gap-4 mb-6">
                    <a href="https://mytsv.com/api/Auth/Social/Google/Redirect" className="p-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all">
                        <FaGoogle />
                    </a>
                </div>
                <p className="text-gray-600 mb-6">or use your email to sign in</p>
                <form onSubmit={handleLogin} className="w-full max-w-md">
                    <div className="mb-6 relative">
                        <input type="email" name="email" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Email</label>
                    </div>
                    <div className="mb-6 relative">
                        <input type="password" name="password" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Password</label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all text-lg font-semibold">Sign In</button>
                </form>
                <p className="mt-6 text-gray-600">
                    Need an account?{" "}
                    <Link to="/Auth/Register" className="font-semibold">
                        Register here
                    </Link>
                </p>
            </div>
            <div className="hidden lg:flex w-1/2 bg-red-900 pattern justify-center items-center p-8">
                <div className="text-white text-center">
                    <h3 className="text-4xl font-bold mb-4">MyTSV</h3>
                    <p className="text-xl mb-8">Connect with your town like never before</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Access your personalized feed</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Interact with local experts</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Stay updated with your town</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
