import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdOutlineFileUpload } from "react-icons/md";
import { FaSave, FaTrash } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { imageUrl } from '../../../../helper';

const BlogsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState({
        title: '',
        description: '',
        body: '',
        thumbnail: null,
    });

    useEffect(() => {
        if (id && id !== 'create') {
            getBlogData(id);
        }
    }, [id]);

    const getBlogData = async (blogId) => {
        try {
            const res = await axios.get(`/Dashboard/Admin/Blogs/${blogId}`);
            setBlog(res?.data);
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        let updatedBlog = { ...blog };

        if (name === 'thumbnail') {
            updatedBlog[name] = files[0];
        } else {
            updatedBlog[name] = value;
        }

        setBlog(updatedBlog);
    };

    const handleBodyChange = (value) => {
        setBlog({ ...blog, body: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(blog).forEach((key) => {
            formData.append(key, blog[key]);
        });

        try {
            await axios.post(`/Dashboard/Admin/Blogs`, formData);
            toast.success('Blog saved successfully');
            navigate('/Admin/Blogs');
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Dashboard/Admin/Blogs/${blog.id}`);
            toast.success('Blog deleted');
            navigate('/Admin/Blogs');
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div className="flex flex-col gap-3 text-gray-800 mb-4">
                <label className='font-medium text-lg ml-2'>Title</label>
                <input
                    type="text"
                    name="title"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md outline-none"
                    placeholder="Title"
                    value={blog?.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex flex-col gap-3 text-gray-800 mb-4">
                <label className='font-medium text-lg ml-2'>Description</label>
                <textarea
                    name="description"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md outline-none"
                    placeholder="Description"
                    value={blog?.description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex flex-col gap-3 text-gray-800 mb-4">
                <label className='font-medium text-lg ml-2'>Body</label>
                <ReactQuill
                    name="body"
                    value={blog?.body}
                    onChange={handleBodyChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-medium text-lg ml-2">
                    Thumbnail
                </label>
                <label
                    htmlFor="thumbnail"
                    className="justify-between rounded-2xl border py-3 px-4 outline-none flex items-center text-gray-500"
                >
                    {blog?.thumbnail ? (
                        <img
                            src={blog.thumbnail.default ? imageUrl(blog.thumbnail.default) : URL.createObjectURL(blog.thumbnail)}
                            alt="Thumbnail"
                            className="w-full h-full object-cover rounded-xl hover:opacity-50 cursor-pointer transition-all max-h-80"
                        />
                    ) : (
                        <div className="flex justify-between w-full items-center">
                            <span className="font-medium flex gap-2">
                                Upload An Image
                                <MdOutlineFileUpload className="text-2xl" />
                            </span>
                            <span className="text-xs">Allowed: JPG, PNG, WEBP</span>
                        </div>
                    )}
                </label>
                <input
                    id="thumbnail"
                    name='thumbnail'
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex gap-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium  text-white border-2 bg-yellow-500 hover:bg-yellow-600 rounded-2xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaSave />
                    Save
                </button>
                {id && id !== 'create' && (
                    <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium text-white border-2 bg-primary hover:bg-primary-dark rounded-3xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaTrash />
                        Delete
                    </button>
                )}
            </div>
        </form>
    );
};

export default BlogsForm;