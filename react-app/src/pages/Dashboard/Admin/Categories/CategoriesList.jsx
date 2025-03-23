import axios from "axios";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import Pagination from "../../../../components/Common/Pagination";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BiPlusCircle, BiSolidCategory } from "react-icons/bi";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const response = await axios.get(`/Dashboard/Admin/Categories`, {
                params: {
                    page,
                    search,
                }
            });
            setCategories(response.data.data);
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
                    <BiSolidCategory />
                    Categories
                </h1>
                <div className="relative w-1/2">
                    <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        className="w-full rounded-2xl border-2 py-3 pl-12 pr-4 outline-none focus:border-primary-light transition-colors"
                        placeholder="Search category..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Link to={'create'} type="button" className="bg-primary text-white py-3 px-8 rounded-2xl flex items-center gap-2">
                    Create <BiPlusCircle />
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full text-left rtl:text-right divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Videos</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-6 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : (
                            categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{category.title}</td>
                                        <td className="px-6 py-4 text-gray-500">{category.videos_count}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/Admin/Categories/${category.id}`} className="py-2 px-4 w-fit flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                                                <CiEdit className="text-xl" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6">
                                        No categories found.
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

export default Categories;