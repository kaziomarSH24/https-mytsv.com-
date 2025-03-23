import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheck, FaPlay, FaTimes, FaYoutube, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdOutlineDelete, MdOutlineVideoSettings } from "react-icons/md";
import ReactPlayer from "react-player";
import Pagination from "../Common/Pagination";
import { debounce, imageUrl } from "../../helper";
import { useCallback } from "react";

const SmartVideosList = ({ userRole = 'user' }) => {
    const [videos, setVideos] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [uploadType, setUploadType] = useState("youtube");
    const [selectedFile, setSelectedFile] = useState(null);
    const [iframeInput, setIframeInput] = useState("");

    const fetchVideos = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const response = await axios.get('Dashboard/Videos', {
                params: { page, search },
            });
            setVideos(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Caught error");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchVideos = useCallback(
        debounce((search, page) => {
            fetchVideos(page, search);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetchVideos(search, currentPage);
    }, [search, currentPage, debouncedFetchVideos]);

    const handleSearch = (search) => {
        setSearch(search);
        setCurrentPage(1);
    };

    const handlePagination = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const videoStatus = async (id, status, videoFileOrLink = null) => {
        // Only allow for admin users
        if (userRole !== 'admin') {
            toast.error("You do not have permission to perform this action.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", status);

        if (videoFileOrLink) {
            formData.append("video", videoFileOrLink);
        }

        try {
            await axios.post(`/Dashboard/VideoModeration`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSelectedVideo(null);
            fetchVideos(currentPage, search);
        } catch (error) {
            toast.error("Failed to update the video.");
        }
    };

    const handleReview = (video) => {
        // Only allow for admin users
        if (userRole !== 'admin') return;

        setIframeInput(video?.video);
        setSelectedVideo(selectedVideo?.id === video.id ? null : video);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file.type.startsWith("video/")) return toast.error("Please upload a valid video.");
        setSelectedFile(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("video/")) return toast.error("Please upload a valid video.");
        setSelectedFile(file);
    };

    const handleVideoSubmission = (id, status) => {
        // Only allow for admin users
        if (userRole !== 'admin') return;

        if (uploadType === "file" && selectedFile) {
            videoStatus(id, status, selectedFile);
        } else if (uploadType === "youtube" && iframeInput) {
            videoStatus(id, status, iframeInput);
        } else {
            toast.error("Please provide a valid video to submit.");
        }
    };

    const renderTableColumns = () => {
        const baseColumns = [
            { header: "Video", width: "25%" },
            { header: "User", width: "auto" },
            { header: "Category", width: "auto" },
            { header: "Status", width: "auto" }
        ];

        // Add Actions column for admin
        if (userRole === 'admin') {
            baseColumns.push({ header: "Action", width: "auto" });
        }

        return baseColumns;
    };

    return (
        <>
            <div className="flex justify-between items-center gap-10 rounded-xl mb-4 pb-4">
                <h1 className="text-4xl font-medium flex items-center gap-3 text-gray-700">
                    <MdOutlineVideoSettings />
                    {userRole === 'admin' ? 'Manage Videos' : 'Videos'}
                </h1>
                {/* Search input */}
                <div className="relative w-1/2">
                    <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        className="w-full rounded-2xl border-2 py-3 pl-12 pr-4 outline-none focus:border-primary-light transition-colors"
                        placeholder="Search videos..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg">
                <table className="min-w-full text-left rtl:text-right divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {renderTableColumns().map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-sm font-medium text-gray-500 ${col.width ? `w-[${col.width}]` : ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={renderTableColumns().length} className="py-6 text-center text-base text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            videos && videos.length > 0 ? (
                                videos.map((video) => (
                                    <React.Fragment key={video.id}>
                                        <tr className={`${video.status === 'WAITING' && userRole === 'admin' ? 'bg-gray-100' : 'bg-white'}`}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                                                <Link to={`${video.id}`} className="hover:text-primary w-fit flex flex-col">
                                                    <picture>
                                                        <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                                        <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                                        <img src={imageUrl(video.thumbnail?.default)}
                                                            className="object-cover w-64 max-h-52 group-hover:opacity-40 rounded-3xl transition-all duration-200 mb-2" />
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

                                            {/* Admin Actions */}
                                            {userRole === 'admin' && (
                                                <td className="px-6 py-4">
                                                    {video.status === 'WAITING' && (
                                                        <button
                                                            onClick={() => handleReview(video)}
                                                            className="mb-4 py-2 px-4 flex items-center gap-2 text-lg bg-blue-500 text-white rounded-2xl"
                                                        >
                                                            <FaPlay className="text-xl" />
                                                            Review
                                                        </button>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Link to={`${video.id}`} className="mr-2 py-2 px-4 flex items-center gap-2 text-lg bg-yellow-500 text-white rounded-2xl">
                                                            <CiEdit className="text-xl" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => videoStatus(video.id, 'delete')}
                                                            className="mr-2 py-2 px-4 flex items-center gap-2 text-lg bg-primary text-white rounded-2xl"
                                                        >
                                                            <MdOutlineDelete className="text-xl" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>

                                        {/* Admin Video Review Modal */}
                                        {userRole === 'admin' && selectedVideo?.id === video.id && (
                                            <tr>
                                                <td colSpan={renderTableColumns().length} className="px-6 py-4 bg-gray-100 rounded-b-xl">
                                                    <div className="flex items-center justify-center gap-10 mb-4">
                                                        <div className="w-full">
                                                            <ReactPlayer
                                                                className="col-span-1 rounded-xl"
                                                                url={video.video}
                                                                height="18rem"
                                                                controls
                                                            />
                                                        </div>
                                                        <h3 className="text-4xl w-44 text-black font-medium flex flex-col text-center">
                                                            <span>OR</span>
                                                            <span className="text-xs">Upload your own</span>
                                                        </h3>
                                                        <div className="w-full">
                                                            {/* Upload type toggle and video upload section */}
                                                            <div className="flex rounded-lg bg-gray-200 p-1 mb-4">
                                                                <button
                                                                    type="button"
                                                                    className={`flex-1 py-2 px-4 items-center flex justify-center gap-2 rounded-md ${uploadType === "youtube" && "bg-white shadow"}`}
                                                                    onClick={() => setUploadType("youtube")}
                                                                >
                                                                    <FaYoutube className="text-xl" />
                                                                    YouTube Link
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`flex-1 py-2 px-4 items-center flex justify-center gap-2 rounded-md ${uploadType === "file" && "bg-white shadow"}`}
                                                                    onClick={() => setUploadType("file")}
                                                                >
                                                                    <FaUpload className="text-xl" />
                                                                    File Upload
                                                                </button>
                                                            </div>
                                                            {uploadType === "youtube" ? (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter YouTube iframe or link"
                                                                    value={iframeInput}
                                                                    onChange={(e) => setIframeInput(e.target.value)}
                                                                    className="w-full rounded-xl p-4 border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="relative w-full h-40 border-dashed border-4 border-gray-300 rounded-lg flex items-center justify-center bg-white"
                                                                    onDragOver={handleDragOver}
                                                                    onDrop={handleDrop}
                                                                >
                                                                    {selectedFile ? (
                                                                        <p>{selectedFile.name}</p>
                                                                    ) : (
                                                                        <p>Drag & Drop a video file here, or click to upload</p>
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        accept="video/*"
                                                                        onChange={handleFileInputChange}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 mb-4">
                                                        <button
                                                            onClick={() => videoStatus(video.id, "CANCELED")}
                                                            className="mt-4 py-2 px-4 flex items-center gap-2 text-lg bg-primary text-white rounded-2xl"
                                                        >
                                                            <FaTimes className="text-xl" />
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleVideoSubmission(video.id, "PUBLISHED")}
                                                            className="mt-4 py-2 px-4 flex items-center gap-2 text-lg bg-green-500 text-white rounded-2xl"
                                                        >
                                                            <FaCheck className="text-xl" />
                                                            Accept
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={renderTableColumns().length} className="text-center py-6">
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
        </>
    );
};

export default SmartVideosList;
