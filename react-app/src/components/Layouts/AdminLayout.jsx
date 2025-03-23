import { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import { BiNews, BiSolidCategory } from "react-icons/bi";
import { FaCog, FaUserCog } from "react-icons/fa";
import { MdOutlineVideoSettings } from "react-icons/md";
import { HiMenu } from "react-icons/hi";

const AdminLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuItems = [
        { to: "/Admin/Videos", text: "Videos", icon: MdOutlineVideoSettings },
        { to: "/Admin/Users", text: "Users", icon: FaUserCog },
        { to: "/Admin/Categories", text: "Categories", icon: BiSolidCategory },
        { to: "/Admin/Blogs", text: "Blogs", icon: BiNews },
        { to: "/Admin/Settings", text: "Settings", icon: FaCog },
    ];

    return (
        <>
            <div className="pt-12 pb-32 md:pb-40 pattern bg-red-950">
                <div className="sm:container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center px-4">
                        <div className="w-full flex justify-between items-center mb-6 md:mb-0">
                            <Link to={'/Admin'} className="text-white text-3xl md:text-6xl font-medium">Admin Panel</Link>
                            <button onClick={toggleMenu} className="text-white text-2xl md:hidden">
                                <HiMenu />
                            </button>
                        </div>
                        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
                            <ul className="text-white text-lg md:text-2xl font-medium flex flex-col md:flex-row gap-4 md:gap-10">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.to} className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                                            {item.text}
                                            <item.icon className="mt-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <section className="sm:container -mt-28 mb-14">
                <div className="shadow-lg rounded-2xl py-10 px-12 bg-white">
                    <Outlet />
                </div>
            </section>
        </>
    );
};

export default AdminLayout;