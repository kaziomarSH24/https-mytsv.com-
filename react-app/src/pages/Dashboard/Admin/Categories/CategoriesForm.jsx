import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdOutlineVideoSettings } from 'react-icons/md';
import Pagination from '../../../../components/Common/Pagination';
import { CiEdit } from 'react-icons/ci';
import { FaSave, FaTrash } from 'react-icons/fa';
import { imageUrl } from '../../../../helper';

const Categories = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({});
    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteWarning, setDeleteWarning] = useState(false); // New state for delete warning

    const getCategories = async (page = 1) => {
        if (params.id) {
            setLoading(true);

            try {
                const res = await axios.get(`/Dashboard/Admin/Categories/${params.id}`, {
                    params: { page },
                });
                setCategory(res?.data?.category);
                setVideos(res?.data?.videos);
                setTotalPages(res.data?.videos?.last_page);
            } catch (e) {
                toast.error(e.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getCategories(currentPage);
    }, [currentPage, params.id]);

    const handlePagination = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleInputChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            id: category.id,
            title: category.title,
        };

        try {
            const res = await axios.post('/Dashboard/Admin/Categories', data);
            setCategory(res.data);
            toast.success('Successfully updated category.');
            navigate('/Admin/Categories');
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Dashboard/Admin/Categories/${category.id}`);
            toast.success('Category and related videos deleted successfully.');
            navigate('/Admin/Categories');
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const showDeleteWarning = () => {
        setDeleteWarning(true); // Show the warning message
    };

    return (
        <div className="mx-auto p-3 max-w-8xl">
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
                <div className="flex flex-col gap-3 text-gray-800 mb-4">
                    <label className='font-medium text-lg ml-2'>Title</label>
                    <input
                        type="text"
                        name="title"
                        className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md outline-none"
                        placeholder="Title"
                        value={category?.title || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Delete button */}
                <div className="flex gap-2">
                    <button type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium  text-white border-2 bg-yellow-500 hover:bg-yellow-600 rounded-3xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaSave />
                        Update Category
                    </button>
                    <button type="button" onClick={showDeleteWarning}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium text-white border-2 bg-primary hover:bg-primary-dark rounded-3xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaTrash />
                        Delete
                    </button>
                </div>
                {deleteWarning && (
                    <div className="bg-red-100 p-4 rounded-lg mt-4">
                        <p className="text-primary-dark">
                            Are you sure you want to delete this category? This action will also delete all related videos.
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button
                                type="button"
                                className="bg-primary text-white py-2 px-4 rounded-xl"
                                onClick={handleDelete}
                            >
                                Confirm Delete
                            </button>
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded-xl"
                                onClick={() => setDeleteWarning(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </form>



            <h2 className='text-3xl font-medium flex items-center gap-3 text-gray-700 mb-6'>
                <MdOutlineVideoSettings />
                Related Videos
            </h2>
            <div className="relative overflow-x-auto rounded-lg">
                <table className="min-w-full text-left rtl:text-right divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Video</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">User</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-base text-gray-500">Loading...</td>
                            </tr>
                        ) : (
                            videos && videos.length > 0 ? (
                                videos.map((video) => (
                                    <tr className={`${video.status === 'WAITING' ? 'bg-gray-100' : 'bg-white'}`} key={video.id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900" width="25%">
                                            <Link className="hover:text-primary">
                                                <picture>
                                                    <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                                    <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                                    <img src={imageUrl(video.thumbnail?.default)}
                                                        className="rounded-lg w-64 h-28 object-cover mb-2" alt={video.title} />
                                                </picture>
                                                <p className="line-clamp-2">{video.title}</p>
                                            </Link>
                                        </th>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">

                                                <picture>
                                                    <source media="(max-width: 767px)" srcSet={imageUrl(video.user?.avatar?.mobile)} />
                                                    <source media="(max-width: 1023px)" srcSet={imageUrl(video.user?.avatar?.tablet)} />
                                                    <img
                                                        src={imageUrl(video.user?.avatar?.default)}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        alt={video.user?.name}
                                                    />
                                                </picture>
                                                <span className="font-medium text-gray-900">{video?.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{video.category?.title}</td>
                                        <th className="px-6 py-4 uppercase font text-gray-600">{video.status}</th>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="mr-2 py-2 px-4 flex items-center gap-2 text-lg bg-yellow-500 text-white rounded-2xl">
                                                    <CiEdit className="text-xl" />
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-6">
                                        No videos found.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePagination}
            />
        </div>
    );
};

export default Categories;
