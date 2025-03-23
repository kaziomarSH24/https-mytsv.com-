import axios from 'axios';
import { useState, useEffect } from 'react';
import Pagination from '../../components/Common/Pagination';
import { imageUrl } from '../../helper';
import { Link } from 'react-router-dom';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch blogs based on current page
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await axios.get(`/Main/getBlogs?page=${currentPage}`);
                setBlogs(data.data?.data);
                setTotalPages(data.data?.last_page);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto my-20">
            <h2 className="text-5xl font-medium mb-8 text-primary">Blogs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <picture>
                            <source media="(max-width: 767px)" srcSet={imageUrl(blog.thumbnail?.mobile)} />
                            <source media="(max-width: 1023px)" srcSet={imageUrl(blog.thumbnail?.tablet)} />
                            <img src={imageUrl(blog.thumbnail?.default)}
                                className="w-full h-48 object-cover" alt={blog?.title} />
                        </picture>
                        <div className="p-6">
                            <Link to={`/blogs/${blog.slug}`} className="text-2xl font-medium mb-2 text-primary transition-colors duration-300 hover:text-primary-dark">
                                {blog.title}
                            </Link>
                            <p className="text-gray-600 mb-4">{blog.description || 'No description available.'}</p>
                            <div className="flex items-center justify-between">
                                <Link to={`/blogs/${blog.slug}`} className="text-primary hover:text-primary-dark transition-colors duration-300">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Blogs;
