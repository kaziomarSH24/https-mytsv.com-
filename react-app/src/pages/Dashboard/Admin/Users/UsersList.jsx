import axios from "axios";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import Pagination from "../../../../components/Common/Pagination";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { imageUrl } from "../../../../helper";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const response = await axios.get(`/Dashboard/Admin/Users`, {
                params: {
                    page,
                    search,
                }
            });
            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            toast.error('Caught Error!');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers(currentPage, search);
    }, [currentPage, search]);

    const handleSearch = (search) => {
        setSearch(search)
        setCurrentPage(1);
    };

    const handlePagination = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center gap-10 rounded-xl mb-4 pb-4">
                <h1 className="text-4xl font-medium flex items-center gap-3 text-gray-700">
                    <FaUser />
                    Users
                </h1>
                <div className="relative w-1/2">
                    <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        className="w-full rounded-2xl border-2 py-3 pl-12 pr-4 outline-none focus:border-primary-light transition-colors"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full text-left rtl:text-right divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">User</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Full Name</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-6 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : (
                            users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <picture>
                                                    <source media="(max-width: 767px)" srcSet={imageUrl(user.avatar?.mobile)} />
                                                    <source media="(max-width: 1023px)" srcSet={imageUrl(user.avatar?.tablet)} />
                                                    <img
                                                        src={imageUrl(user.avatar?.default)}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        alt={user?.name}
                                                    />
                                                </picture>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{user.full_name}</td>
                                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/Admin/Users/${user.id}`} className="py-2 px-4 w-fit flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                                                <CiEdit className="text-xl" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6">
                                        No videos found.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePagination} />
        </>
    );
};

export default Users;