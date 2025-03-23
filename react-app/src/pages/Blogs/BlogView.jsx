import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { imageUrl } from '../../helper';

const BlogPost = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await axios.get(`/Main/getBlog/${slug}`);
                setBlog(data?.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div>Loading...</div>;

    if (!blog) return <div>Blog not found.</div>;

    return (
        <div className="container mx-auto my-20">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <picture>
                    <source media="(max-width: 767px)" srcSet={imageUrl(blog.thumbnail?.mobile)} />
                    <source media="(max-width: 1023px)" srcSet={imageUrl(blog.thumbnail?.tablet)} />
                    <img src={imageUrl(blog.thumbnail?.default)}
                        className="w-full h-64 object-cover" alt={blog?.title} />
                </picture>
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-4 text-primary">{blog.title}</h1>
                    <p className="text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: blog.body }}>
                    </p>
                    <div className="flex items-center justify-between">
                        <Link to={"/blogs"} className="text-primary hover:text-primary-dark transition-colors duration-300">
                            Read More Blogs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
