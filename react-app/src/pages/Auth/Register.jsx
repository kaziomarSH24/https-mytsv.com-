import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { usePrimary } from "../../context/PrimaryContext";
// axios.defaults.baseURL = "http://127.0.0.1:8000/api/" //add this line to set base url for axios
const Signup = () => {
    const navigate = useNavigate();
    const { state, dispatch } = usePrimary();

    useEffect(() => {
        if (state.user) {
            navigate("/");
        }
    }, [state.user, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        const channelName = e.target.channelName.value;
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const checkbox = e.target.checkbox.checked;

        if (!channelName || !name || !email || !password || !confirmPassword) {
            toast.error("All fields are required!");
        } else if (!checkbox) {
            toast.error("Please agree to Terms and Privacy.");
        } else {
            try {
                const res = await axios.post("Auth/Register", {
                    name: channelName,
                    full_name: name,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword,
                });
                console.log(res, "res");

                if (res.data?.status === "success") {
                    localStorage.setItem("accessToken", res.data?.token);
                    console.log(res.data,"35345345345345435634");
                    dispatch({ type: "SET_USER", payload: res.data?.user });
                    toast.success("Successfully registered");
                    navigate("/User/Settings");
                }
            } catch (e) {
                toast.error(e.response?.data?.message);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left side - Signup Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
                <Link to="/" className="mb-8">
                    <img src="/assets/logo.webp" alt="Logo" className="w-40 h-auto" />
                </Link>

                <h2 className="text-4xl font-bold text-primary mb-6">Create an Account</h2>

                <div className="flex gap-4 mb-6">
                    <a href="https://mytsv.com/api/Auth/Social/Google/Redirect" className="p-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all">
                        <FaGoogle />
                    </a>
                </div>

                <p className="text-gray-600 mb-6">or use your email to register:</p>

                <form onSubmit={handleSignup} className="w-full max-w-md">
                    <div className="mb-4 relative">
                        <input type="text" name="channelName" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Channel Name</label>
                    </div>

                    <div className="mb-4 relative">
                        <input type="text" name="name" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Name</label>
                    </div>

                    <div className="mb-4 relative">
                        <input type="email" name="email" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Email</label>
                    </div>

                    <div className="mb-4 relative">
                        <input type="password" name="password" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Password</label>
                    </div>

                    <div className="mb-6 relative">
                        <input type="password" name="confirmPassword" required className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-primary outline-none transition-all peer placeholder-transparent" />
                        <label className="absolute left-3 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5">Confirm Password</label>
                    </div>

                    <div className="flex items-center mb-6">
                        <input type="checkbox" name="checkbox" id="checkbox" className="mr-2" required />
                        <label htmlFor="checkbox" className="text-sm text-gray-600">
                            I agree to the{" "}
                            <Link to="#" className="text-primary hover:underline">
                                Terms and Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all text-lg font-semibold">
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/Auth/Login" className="text-primary font-semibold">
                        Login here
                    </Link>
                </p>
            </div>

            {/* Right side - Visual Element */}
            <div className="hidden lg:flex w-1/2 bg-red-900 pattern justify-center items-center p-8">
                <div className="text-white text-center">
                    <h3 className="text-4xl font-bold mb-4">MyTSV</h3>
                    <p className="text-xl mb-8">Meet your Town Specialists Videos</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Discover local experts</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Watch informative videos</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Connect with your community</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
