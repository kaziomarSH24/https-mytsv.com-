import "swiper/css";
import axios from "axios";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Select from "react-select";
import { FaBars } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { VscSignOut } from "react-icons/vsc";
import { FaInfoCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { BiNews, BiSolidVideoPlus } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef, useEffect, Fragment } from "react";
import { IoClose, IoLocationSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { BsChevronUp, BsGlobeAmericas, BsGraphUpArrow, BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import BsChevronLeft from '@meronex/icons/bs/BsChevronLeft';
import { IoMdClose, IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { AiFillPlayCircle, AiFillSetting } from "react-icons/ai";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDetectClickOutside } from "react-detect-click-outside";
import { imageUrl } from "../../helper";
import { usePrimary } from "../../context/PrimaryContext";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { toast } from "react-toastify";

const Header = ({ states, categories, locator }) => {
    const { query, id } = useParams();
    const navigate = useNavigate();
    const url = useLocation();
    const { dispatch } = usePrimary();
    const prevScrollY = useRef(0);
    const [user, setUser] = useState({});
    const [location, setLocation] = useState({});
    const [searchText, setSearchText] = useState("");
    const [citiesData, setCitiesData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [locationModal, setLocationModal] = useState(false);
    const [showCategories, setShowCategories] = useState(true);
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const userRef = useDetectClickOutside({ onTriggered: () => setShowDropdown(false) });
    const notificationRef = useDetectClickOutside({ onTriggered: () => setNotificationDropdown(false) });
    const locationRef = useRef(null);
    const swiperRef = useRef(null);
    //location contextApi

    const getUser = async () => {
        const user = await axios.get("Auth/Me");
        dispatch({ type: "SET_USER", payload: user.data });
        setUser(user.data);
    };


    // console.log(selectedCity, "Selected City");
    // console.log(citiesData, "Cities Data");
    const getLocation = async () => {
        const location = await axios.get("Main/getLocation");
        setLocation(location.data);
    };

    useEffect(() => {
        getUser();
        getLocation();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleWindowSizeChange);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [url]);

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchText}`);
    };

    const handleClickOutside = (event) => {
        if (locationRef.current && !locationRef.current.contains(event.target)) {
            setLocationModal(false);
        }
    };
    //clear select value
    const clearValue = () => {
        setSelectedState(null);
        setSelectedCity(null);
        dispatch({ type: "SET_SELECTED_LOCATION", payload: "" });
        setLocationModal(false);
        toast.success("Location cleared successfully!");
    };

    //unauthenticated user error message
    const handleUnauthenticated = () => {
        toast.error("Please login to continue!");
        setTimeout(() => {
            navigate("/Auth/Login");
        }, 2000);
    };

    const renderCategoryLinks = () => {
        if (!Array.isArray(categories) || !categories.length) {
            return (
                <div className="flex gap-x-8">
                    {[...Array(6)].map((_, idx) => (
                        <Skeleton key={idx} borderRadius={150} width={Math.random() * (180 - 70) + 70} height={25} />
                    ))}
                </div>
            );
        }

        return (
            <>
                <div className={`px-3 py-2 rounded-lg border font-Roboto text-[14px] ${!id && "bg-gray-600 text-white"}`}>
                    <Link to={`/`}>All</Link>
                </div>

                <Swiper
                    className="relative"
                    modules={[Navigation]}
                    // navigation
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMode={true}
                    // pagination={{ clickable: true }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id} style={{ width: "auto" }}>
                            <div className={`px-3 py-2 rounded-lg border font-Roboto text-[14px] ${id === `${category.id}` ? "bg-gray-600 text-white" : ""}`}>
                                <Link to={`/search/${category.id}`}>{category.title}</Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button className="absolute top-5 left-6 text-slate-800 px-4 py-2 rounded hidden md:block" onClick={() => swiperRef.current?.slidePrev()}>
                    <svg width="15" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.975 20L12.75 18.225L4.525 10L12.75 1.775L10.975 0L0.974999 10L10.975 20Z" fill="#666666" />
                    </svg>
                </button>
                <button className="absolute top-5 right-3  text-slate-800 px-4 py-2 rounded hidden md:block" onClick={() => swiperRef.current?.slideNext()}>
                    <svg width="15" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.525 20L0.75 18.225L8.975 10L0.75 1.775L2.525 0L12.525 10L2.525 20Z" fill="#666666" />
                    </svg>
                </button>
            </>
        );
    };

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (prevScrollY.current < currentScrollY && currentScrollY > 0) {
            setShowCategories(false);
        } else {
            setShowCategories(true);
        }
        prevScrollY.current = currentScrollY;
    };

    const isMobile = width <= 768;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const showUserDropdown = () => {
        if (isMobile) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setShowDropdown(!showDropdown);
        }
    };

    const loadCitiesData = async (stateValue) => {
        try {
            const res = await axios.get(`Main/getLocations/${stateValue}`);
            setCitiesData(Object.keys(res.data).map((key) => ({ value: key, label: res.data[key] })));
        } catch (error) {
            console.error("Error loading cities:", error);
        }
    };

    const stateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        loadCitiesData(selectedOption.value);
    };

    const cityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
    };

    const handleSaveLocation = async () => {
        try {
            await axios.post("Main/updateLocation", {
                state: selectedState?.value,
                city: selectedCity?.value,
            });
            dispatch({ type: "SET_SELECTED_LOCATION", payload: selectedCity });
            setLocationModal(false);
            toast.success("Location set successfully!");
        } catch (error) {
            console.error("Failed to save location:", error);
        }
    };

    const Logout = async () => {
        await axios.post("Auth/Logout");
        localStorage.setItem("accessToken", null);
        window.location.reload();
    };

    return (
        <>
            {/* Location Modal */}
            <div className={`flex items-center justify-center z-20 left-0 top-0 bottom-0 right-0 animate__animated ${locationModal ? "fixed animate__fadeIn" : "hidden"}`}>
                <div ref={locationRef} className="bg-white lg:w-1/3 md:mt-32 p-6 rounded-3xl border mx-4 border-gray-200 shadow-[0px_0px_100px_1px_rgba(0,0,0,1)]">
                    <div className="flex flex-col text-center text-2xl">
                        <div className="sm:px-6 px-2">
                            <div className="flex justify-between items-center mb-5">
                                <span className="font-medium flex items-center gap-2 md:text-2xl">
                                    <IoLocationSharp className="text-primary text-4xl" />
                                    <div className="flex flex-col items-start">
                                        <span>Choose Location</span>
                                        {locator ? <span className="text-xs hidden sm:block">For show related videos depended on location</span> : <span className="text-xs hidden sm:block text-primary">Location only working in USA</span>}
                                    </div>
                                </span>
                                <IoClose className="text-3xl cursor-pointer" onClick={() => setLocationModal(false)} />
                            </div>
                            {locator && (
                                <h2 className="font-medium text-gray-700 text-2xl flex items-center justify-center gap-2">
                                    {location?.city}
                                    <BsGlobeAmericas className="mt-1" />
                                </h2>
                            )}
                            <div className="flex gap-6 w-full mb-10 mt-5">
                                <div className="flex-1">
                                    <Select
                                        options={states}
                                        isDisabled={!locator}
                                        onChange={stateChange}
                                        value={selectedState}
                                        placeholder="State"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                borderRadius: "1rem",
                                                padding: "0.3rem 0.5rem",
                                                fontWeight: "500",
                                                width: "100%",
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                color: "#6b7280",
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={citiesData}
                                        isDisabled={!selectedState}
                                        onChange={cityChange}
                                        value={selectedCity}
                                        placeholder="City"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                borderRadius: "1rem",
                                                padding: "0.3rem 0.5rem",
                                                fontWeight: "500",
                                                width: "100%",
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                color: "#6b7280",
                                            }),
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between text-base font-medium text-center gap-4">
                                <button className="bg-white border rounded-xl px-8 py-2" onClick={() => setLocationModal(false)}>
                                    Close
                                </button>
                                <div>
                                    <button className="bg-white border rounded-xl px-8 py-2 mr-3" onClick={() => clearValue()}>
                                        Clear
                                    </button>
                                    <button className="bg-primary text-white rounded-xl px-8 py-2" onClick={handleSaveLocation}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Location Modal end */}

            <div className={`fixed top-0 left-0 w-full h-full bg-white z-30 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <Link to={"/"}>
                        <img src="/assets/logo.webp" width={120} height={50} alt="Logo" className="max-w-[120px]" />
                    </Link>
                    <button onClick={toggleSidebar} className="text-red-700 text-2xl">
                        <IoMdClose className="text-3xl" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-col gap-2 mb-4">
                        {user?.id && (
                            <div className="flex justify-between items-center border-b mb-2 pb-4">
                                <div className="flex">
                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={imageUrl(user?.avatar?.mobile)} />
                                        <source media="(max-width: 1023px)" srcSet={imageUrl(user?.avatar?.tablet)} />
                                        <img src={imageUrl(user?.avatar?.default)} className="w-12 h-12 rounded-full mr-3 object-cover" alt={user?.name} />
                                    </picture>
                                    <div className="block text-dark-white">
                                        <p className="text-sm text-gray-700"> Welcome, Back </p>
                                        <p className="text-lg font-medium">{user?.name}</p>
                                    </div>
                                </div>
                                <Link to={"/User/Profile"} className="h-full text-2xl">
                                    <BsChevronUp className="text-primary rotate-90" />
                                </Link>
                            </div>
                        )}
                        <label className="font-medium text-2xl text-gray-600 items-center mx-1 flex gap-2 cursor-pointer mb-2" data-tooltip-id="location">
                            <IoLocationSharp className="text-primary" />
                            Location
                            <FaInfoCircle className="mt-1 text-sm" />
                        </label>
                        <ReactTooltip id="location" content="For Show Related Videos" />
                        <div className="flex gap-4 w-full">
                            <div className="flex-1">
                                <Select
                                    options={states}
                                    onChange={stateChange}
                                    value={selectedState}
                                    placeholder="State"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: "1rem",
                                            padding: "0.3rem 0.5rem",
                                            outline: "none",
                                            fontWeight: "500",
                                            width: "100%", // Ensure full width
                                            boxSizing: "border-box",
                                        }),
                                        placeholder: (provided) => ({
                                            ...provided,
                                            color: "#6b7280",
                                        }),
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={citiesData}
                                    isDisabled={!selectedState}
                                    onChange={cityChange}
                                    value={selectedCity}
                                    placeholder="City"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: "1rem",
                                            padding: "0.3rem 0.5rem",
                                            outline: "none",
                                            fontWeight: "500",
                                            width: "100%", // Ensure full width
                                            boxSizing: "border-box",
                                        }),
                                        placeholder: (provided) => ({
                                            ...provided,
                                            color: "#6b7280",
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-base font-medium text-center gap-4">
                            <button className="bg-white border rounded-xl px-8 py-2 mr-3" onClick={() => clearValue()}>
                                Clear
                            </button>
                            <div>
                                <button className="bg-primary text-white rounded-xl px-8 py-2" onClick={handleSaveLocation}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    {user.id && (
                        <div className="flex flex-col p-2 gap-6 text-2xl font-medium text-gray-600 border-t mt-6 pt-6">
                            <Link to={"/User/Profile"} className="flex items-center gap-3">
                                <CgProfile className="text-primary" />
                                Profile
                            </Link>
                            <Link to={"/User/Profile"} className="flex items-center gap-3">
                                <IoMdNotifications className="text-primary" />
                                Notifications
                            </Link>
                            <Link to={"/User/Videos"} className="flex items-center gap-3">
                                <AiFillPlayCircle className="text-primary" />
                                My Videos
                            </Link>
                            {/* <Link to={"/User/Analytics"} className="flex items-center gap-3">
                                <BsGraphUpArrow className="text-primary" />
                                Analytics
                            </Link> */}
                            <Link to={"/User/Upload"} className="flex items-center gap-3">
                                <CgProfile className="text-primary" />
                                Promotion
                            </Link>
                            <Link to={"/User/Settings"} className="flex items-center gap-3 border-b pb-6">
                                <AiFillSetting className="text-primary" />
                                Settings
                            </Link>
                            <button onClick={() => Logout()} className="flex items-center gap-3">
                                <VscSignOut className="text-primary" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="sticky top-0 z-20">
                <div className={`bg-white transition-all duration-300 ${!showCategories && "shadow-[0px_5px_10px_0px_rgba(0,0,0,0.1)]"}`}>
                    <header className="container flex justify-between items-center py-5">
                        {/* Logo Section */}
                        <Link to="/">
                            <img src="/assets/logo.webp" alt="Logo" width={120} height={50} className="w-full hidden md:inline max-w-[150px]" />
                            <img src="/assets/short-logo.webp" alt="Logo" width={50} height={50} className="w-full md:hidden max-w-[50px]" />
                        </Link>

                        {/* Search Bar Section */}
                        <div className="w-2/3 md:w-1/2 px-4">
                            <form className="w-full rounded-full border-[1px] border-[#CACACA] py-1 px-1 flex" onSubmit={handleSearch}>
                                <input type="text" className="outline-none border-none md:text-sm text-xs sm:pl-4 pl-2 flex-1 rounded-lg" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                                <button className="md:w-9 md:h-9 w-6 h-6 bg-primary flex justify-center items-center rounded-full text-white" onClick={handleSearch}>
                                    <CiSearch className="md:text-xl text-sm" />
                                </button>
                            </form>
                        </div>

                        {/* User & Notification Section */}
                        {user?.id ? (
                            <div className="flex gap-4 items-center relative">
                                <div className="hidden md:flex xl:gap-6 gap-3 items-center relative">
                                    <Link to={"/blogs"}>
                                        <BiNews className="md:text-3xl text-xl" />
                                    </Link>
                                    <IoLocationSharp className="md:text-3xl text-xl cursor-pointer" onClick={() => setLocationModal(!locationModal)} />
                                    <Link to={`/User/Upload`}>
                                        <BiSolidVideoPlus className="md:text-3xl text-xl cursor-pointer" />
                                    </Link>
                                    <div className="relative cursor-pointer xl:mr-3" ref={notificationRef} onClick={() => setNotificationDropdown(!notificationDropdown)}>
                                        <span className="absolute border-[2px] border-white rounded-full w-5 h-5 flex justify-center items-center bg-primary text-white text-[11px] -top-1.5 -right-1.5">0</span>
                                        <IoMdNotifications className="md:text-3xl text-xl " />
                                        {notificationDropdown && (
                                            <div className="shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] rounded-xl py-4 px-4 absolute right-0 top-12 w-52 z-20 text-center bg-white">
                                                <span className="font-medium text-xl text-primary-dark capitalize">Notifications</span>
                                                <hr className="my-2.5" />
                                                <h1>No New Notifications</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div ref={userRef}>
                                    <div className="md:flex items-center cursor-pointer hidden" onClick={showUserDropdown}>
                                        <span className="absolute md:hidden border-[2px] border-white rounded-full w-5 h-5 flex justify-center items-center bg-primary text-white text-[11px] -top-1.5 -right-1">0</span>
                                        <picture>
                                            <source media="(max-width: 767px)" srcSet={imageUrl(user?.avatar?.mobile)} />
                                            <source media="(max-width: 1023px)" srcSet={imageUrl(user?.avatar?.tablet)} />
                                            <img src={imageUrl(user?.avatar?.default)} className="rounded-full w-8 h-8 mr-2" alt={user?.name} />
                                        </picture>
                                        <BsChevronUp className={!showDropdown && "rotate-180 hidden md:block"} />
                                    </div>
                                    <div className={`animate__animated animate__fadeIn shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] rounded-xl py-4 px-5 absolute right-0 top-12 w-48 z-20 bg-white ${!showDropdown && "hidden"} `}>
                                        <span className="font-medium text-xl text-primary-dark capitalize">{user.name}</span>
                                        <hr className="my-2.5" />
                                        <Link to={`/User/Profile`} className="flex items-center gap-3 text-blue-900 text-sm mb-2">
                                            <CgProfile className="text-primary text-lg" />
                                            Profile
                                        </Link>
                                        <button onClick={() => Logout()} className="flex items-center gap-3 text-blue-900 text-sm mb-2">
                                            <VscSignOut className="text-primary text-lg" />
                                            Sign Out
                                        </button>
                                        <hr className="my-3" />
                                        <Link to={`/User/Videos`} className="flex items-center gap-3 text-blue-900 text-sm mb-1">
                                            <AiFillPlayCircle className="text-primary text-lg" />
                                            My Videos
                                        </Link>
                                        {/* <Link to={`/User/Analytics`} className="flex items-center gap-3 text-blue-900 text-sm mb-1">
                                            <BsGraphUpArrow className="text-primary text-lg" />
                                            Analytics
                                        </Link> */}
                                        <Link to={`/User/Upload`} className="flex items-center gap-3 text-blue-900 text-sm mb-1">
                                            <CgProfile className="text-primary text-lg" />
                                            Promotion
                                        </Link>
                                        <Link to={`/User/Settings`} className="flex items-center gap-3 text-blue-900 text-sm mb-1">
                                            <AiFillSetting className="text-primary text-lg" />
                                            Settings
                                        </Link>
                                        {user?.admin === 1 && (
                                            <>
                                                <hr className="my-3" />
                                                <Link to={`/Admin`} className="flex items-center gap-3 text-blue-900 text-sm mb-1">
                                                    <CgProfile className="text-primary text-lg" />
                                                    Admin Panel
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {user.id ? (
                                    <div className="md:block hidden">
                                        <Skeleton borderRadius={150} width={150} height={30} />
                                    </div>
                                ) : (
                                    <div className="xl:gap-6 gap-3 items-center md:flex hidden">
                                        <Link to={"/blogs"}>
                                            <BiNews className="md:text-3xl text-xl" />
                                        </Link>
                                        <IoLocationSharp className="md:text-3xl text-xl cursor-pointer" onClick={() => setLocationModal(!locationModal)} />
                                        <Link to={`/Auth/Login`} className="md:block hidden">
                                            <BiSolidVideoPlus className="md:text-3xl text-xl cursor-pointer mr-3" />
                                        </Link>
                                        <div className="md:flex gap-4 hidden">
                                            <Link to="/Auth/Register" className="bg-primary text-white md:text-sm text-xs md:px-7 px-4 md:py-2 py-1 rounded-full">
                                                Sign Up
                                            </Link>
                                            <Link to="/Auth/Login" className="text-[#0A2A8D] md:text-sm text-xs md:px-7 px-4 md:py-2 py-1 rounded-full border-[1px] border-[#CACACA] lg:block hidden">
                                                Sign In
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="md:hidden text-xl flex">
                            <FaBars className="text-primary" onClick={toggleSidebar} />
                        </div>
                    </header>

                    {/* Mobile Icons Section */}
                    <div className="container md:px-0 flex justify-between items-center text-2xl md:hidden py-3 border-t">
                        {!user.id ? (
                            <button type="button" onClick={() => handleUnauthenticated()}>
                                <BiSolidVideoPlus className="text-primary" />
                            </button>
                        ) : (
                        <Link to="/User/Upload">
                            <BiSolidVideoPlus className="text-primary" />
                        </Link>
                        )}
                        <Link to={"/blogs"}>
                            <BiNews className="text-primary" />
                        </Link>
                        <Link to="/User/Profile" className="relative">
                            <span className="absolute border-[2px] border-white rounded-full w-5 h-5 flex justify-center items-center bg-primary text-white text-[11px] -top-1.5 -right-1.5">0</span>
                            <IoMdNotificationsOutline className="text-primary" />
                        </Link>
                        {!user.id ? (
                            <Link to={"/Auth/Login"}>
                                <LuLogIn className="text-primary" />
                            </Link>
                        ) : (
                            <button type="button" onClick={showUserDropdown}>
                                <picture>
                                    <source media="(max-width: 767px)" srcSet={imageUrl(user?.avatar?.mobile)} />
                                    <source media="(max-width: 1023px)" srcSet={imageUrl(user?.avatar?.tablet)} />
                                    <img src={imageUrl(user?.avatar?.default)} className="rounded-full w-8 h-8" alt={user?.name} />
                                </picture>
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories Section */}
            </div>
            <div className={`max-w-[1167px] mx-auto bg-white z-30 md:rounded-b-2xl transition-all duration-300 ${showCategories ? "translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"}`}>
                <div className="sm:container md:py-4 py-3 overflow-hidden">
                    <div className="flex md:gap-x-4 pl-2 sm:pl-0 gap-x-2 md:text-lg text-sm whitespace-nowrap">{renderCategoryLinks()}</div>
                </div>
            </div>
        </>
    );
};

export default Header;
