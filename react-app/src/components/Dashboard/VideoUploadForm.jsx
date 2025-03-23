import { useState, useEffect, useCallback } from 'react';
import Select from "react-select";
import { FaInfoCircle, FaUpload, FaYoutube } from "react-icons/fa";
import { BsGlobeAmericas, BsMegaphone } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import NumberFormatter from '../Common/FormatNumber';

const PRICE_OPTIONS = [1, 2, 3];
const ALLOWED_VIDEO_TYPE = "video/";
const UPLOAD_PRICE = 99;
const PROMOTION_PRICE = 99;

const selectStyles = {
    control: (provided) => ({
        ...provided,
        borderRadius: "1rem",
        padding: "0.3rem 0.5rem",
        outline: "none",
        fontWeight: "500",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#6b7280",
    }),
};

const VideoUploadForm = ({ videoId, mode = 'user' }) => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        videoInfo: null,
        thumbnail: null,
        isPromoted: false,
        selectedFile: null,
        uploadType: "file",
        selectedCountry: null,
        selectedCity: null,
        categories: [],
        locations: [],
        cities: []
    });

    const fetchVideoAndFormData = useCallback(async () => {
        try {
            const [videoRes, categoriesRes, locationsRes] = await Promise.all([
                axios.get(`Dashboard/Videos/${videoId}`),
                axios.get("Main/getCategories"),
                axios.get("Main/getLocations")
            ]);
            setFormState(prev => ({
                ...prev,
                videoInfo: videoRes.data,
                isPromoted: videoRes.data.promoted || false,
                uploadType: videoRes.data.iframe ? "youtube" : "file",
                categories: categoriesRes.data.map(val => ({ label: val.title, value: val.id })),
                locations: Object.keys(locationsRes.data).map(key => ({ value: key, label: locationsRes.data[key] }))
            }));
        } catch (error) {
            toast.error("Failed to load video data");
            navigate('/User/Videos');
        }
    }, [videoId, navigate]);

    const fetchCities = useCallback(async (countrySlug) => {
        try {
            const citiesRes = await axios.get(`Main/getLocations/${countrySlug}`);
            setFormState(prev => ({
                ...prev,
                cities: Object.keys(citiesRes.data).map(key => ({ value: key, label: citiesRes.data[key] }))
            }));
        } catch (error) {
            toast.error("Failed to load cities");
        }
    }, []);

    useEffect(() => {
        fetchVideoAndFormData();
    }, [fetchVideoAndFormData]);

    const handleFileValidation = useCallback((file) => {
        if (!file.type.startsWith(ALLOWED_VIDEO_TYPE)) {
            toast.error("Please upload a video file");
            return false;
        }
        return true;
    }, []);

    const handleFileInputChange = useCallback((e) => {
        const file = e.target.files[0];
        if (handleFileValidation(file)) {
            setFormState(prev => ({ ...prev, selectedFile: file }));
        }
    }, [handleFileValidation]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            videoInfo: { ...prev.videoInfo, [name]: value }
        }));
    }, []);

    const handleCountryChange = useCallback((selectedOption) => {
        fetchCities(selectedOption.value);
        setFormState(prev => ({
            ...prev,
            selectedCountry: selectedOption,
            selectedCity: null,
            videoInfo: { ...prev.videoInfo, location_id: selectedOption.value }
        }));
    }, [fetchCities]);

    const handleCityChange = useCallback((selectedOption) => {
        setFormState(prev => ({
            ...prev,
            selectedCity: selectedOption,
            videoInfo: { ...prev.videoInfo, location_id: selectedOption.value }
        }));
    }, []);

    const handleCategoryChange = useCallback((selectedOption) => {
        setFormState(prev => ({
            ...prev,
            videoInfo: { ...prev.videoInfo, category_id: selectedOption.value }
        }));
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (handleFileValidation(file)) {
            setFormState(prev => ({ ...prev, selectedFile: file }));
        }
    }, [handleFileValidation]);

    const handleUploadTypeChange = useCallback((type) => {
        setFormState(prev => ({ ...prev, uploadType: type }));
    }, []);

    const handlePromotedChange = useCallback(() => {
        setFormState(prev => ({ ...prev, isPromoted: !prev.isPromoted, videoInfo: { ...prev.videoInfo, promoted: !prev.isPromoted } }));
    }, []);

    const handleThumbnailChange = useCallback((e) => {
        setFormState(prev => ({ ...prev, thumbnail: e }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState(prev => ({ ...prev, isLoading: true }));

        try {
            const payload = new FormData();
            payload.append('title', formState.videoInfo.title);
            payload.append('description', formState.videoInfo.description);
            payload.append('category', formState.videoInfo.category_id);
            payload.append('location', formState.videoInfo.location_id);
            payload.append('price', formState.videoInfo.price);
            payload.append('promoted', formState.videoInfo.promoted ?? false);

            if (formState.thumbnail) {
                payload.append('thumbnail', formState.thumbnail.target.files[0]);
            } else {
                payload.append('thumbnail', formState.videoInfo.thumbnail);
            }

            if (formState.selectedFile) {
                payload.append('video', formState.selectedFile);
            } else {
                payload.append('video', formState.videoInfo.video);
            }

            const res = await axios.post('/Dashboard/Videos', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.url) {
                window.open(res.data.url, "_self");
            } else {
                navigate(mode == 'user' ? '/User/Videos' : '/Admin/Videos');
                toast.success("Video uploaded successfully");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update video");
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const isPayable = mode === 'create' && (formState.isPromoted || formState.uploadType === "file");
    const price = (formState.isPromoted ? PROMOTION_PRICE : 0) + (formState.uploadType === "file" ? UPLOAD_PRICE : 0);

    const renderVideoUpload = () => {
        if (formState.uploadType !== "file") {
            return (
                <input
                    type="text"
                    className="w-full rounded-xl p-4 border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter YouTube video link or iframe..."
                    name="video"
                    value={formState.videoInfo?.video || ""}
                    onChange={handleInputChange}
                />
            );
        }

        if (mode !== 'create' && formState.videoInfo?.video) {
            return (
                <div className="p-4 bg-gray-100 rounded-xl h-96">
                    <ReactPlayer url={formState.videoInfo.video} width="100%" height="100%" controls />
                </div>
            );
        }

        if (formState.selectedFile) {
            return (
                <ReactPlayer
                    className="w-full h-full rounded-xl"
                    url={URL.createObjectURL(formState.selectedFile)}
                    controls
                />
            );
        }

        return (
            <div className="flex flex-col items-center p-8 border-2 border-dashed rounded-3xl">
                <FaUpload className="text-4xl mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drag and drop your video here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer">
                    Choose File
                    <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileInputChange}
                    />
                </label>
            </div>
        );
    };

    const handleDelete = async () => {
        setFormState(prev => ({ ...prev, isLoading: true }));
        const res = await axios.delete(`/Dashboard/Videos/${videoId}`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.data.status === 'success') {
            navigate(mode == 'user' ? '/User/Videos' : '/Admin/Videos');
            toast.success("Video deleted successfully");
        } else {
            toast.error("Deleting video failed");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {mode !== 'create' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-3 gap-y-6 rounded-2xl p-8 mb-6 border-b">
                    <div>
                        <h5 className="text-black font-medium text-[16px]">
                            Total Video Views
                        </h5>
                        <h2 className="text-[#0A2A8D] font-bold text-[28px]">
                            <NumberFormatter value={formState.videoInfo?.views} />
                        </h2>
                        <p className="text-[#071148] text-[14px] font-[400]">
                            {new Date(formState.videoInfo?.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="mx-2">-</span>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <h5 className="text-black font-medium text-[16px]">Total Comments</h5>
                        <h2 className="text-[#0A2A8D] font-bold text-[28px]">
                            <NumberFormatter value={formState.videoInfo?.comments_count} />
                        </h2>
                        <p className="text-[#071148] text-[14px] font-[400]">
                            {new Date(formState.videoInfo?.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="mx-2">-</span>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <h5 className="text-black font-medium text-[16px]">Total Like</h5>
                        <h2 className="text-[#0A2A8D] font-bold text-[28px]">
                            <NumberFormatter value={formState.videoInfo?.likes} />
                        </h2>
                        <p className="text-[#071148] text-[14px] font-[400]">
                            {new Date(formState.videoInfo?.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="mx-2">-</span>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <h5 className="text-black font-medium text-[16px]">Total Share</h5>
                        <h2 className="text-[#0A2A8D] font-bold text-[28px]">
                            <NumberFormatter value={formState.videoInfo?.shares} />
                        </h2>
                        <p className="text-[#071148] text-[14px] font-[400]">
                            {new Date(formState.videoInfo?.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="mx-2">-</span>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}
            <div className="md:flex justify-between gap-8 mb-10 rounded-2xl">
                <div className="w-full">
                    {mode === 'create' && (
                        <div className="flex rounded-xl bg-gray-200 p-1 mb-4">
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 items-center flex justify-center gap-2 rounded-xl ${formState.uploadType === "youtube" && "bg-white shadow"}`}
                                onClick={() => handleUploadTypeChange("youtube")}
                            >
                                <FaYoutube className="text-xl" />
                                YouTube Link (Free)
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 items-center flex justify-center gap-2 rounded-xl ${formState.uploadType === "file" && "bg-white shadow"}`}
                                onClick={() => handleUploadTypeChange("file")}
                            >
                                <FaUpload className="text-xl" />
                                File Upload (${UPLOAD_PRICE})
                            </button>
                        </div>
                    )}

                    <div
                        className="relative w-full group rounded-2xl cursor-pointer mb-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {renderVideoUpload()}
                    </div>

                    {mode === 'create' && (
                        <div className="flex items-center mb-5">
                            <input
                                type="checkbox"
                                id="promote"
                                checked={formState.isPromoted}
                                onChange={handlePromotedChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="promote"
                                className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${formState.isPromoted ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                <BsMegaphone className={`mr-2 ${formState.isPromoted && "animate-pulse"}`} />
                                Promote for ${PROMOTION_PRICE}/month
                            </label>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {mode !== 'create' && (
                            <div className='ml-1'>
                                <h2 className='font-medium text-gray-700 text-2xl flex items-center gap-2'>
                                    {formState.videoInfo?.location?.title}
                                    <BsGlobeAmericas className='mt-1' />
                                </h2>
                                <span className='text-gray-600 text-sm flex items-center gap-1.5 mt-1.5'>
                                    <FaInfoCircle className='text-gray-500' />
                                    Keep blank to save same location
                                </span>
                            </div>
                        )}
                        <Select
                            options={formState.locations}
                            value={formState.selectedCountry}
                            onChange={handleCountryChange}
                            placeholder="Country"
                            className="mb-2"
                            styles={selectStyles}
                        />
                        <Select
                            options={formState.cities}
                            value={formState.selectedCity}
                            onChange={handleCityChange}
                            placeholder="City"
                            className="mb-2"
                            styles={selectStyles}
                            isDisabled={!formState.selectedCountry}
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4 mt-5 md:mt-0">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-500">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="text-lg font-medium rounded-2xl border py-2 px-4 outline-none"
                            placeholder="Title..."
                            value={formState.videoInfo?.title || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-500">Category</label>
                        <Select
                            options={formState.categories}
                            value={formState.categories.find(cat => cat.value === formState.videoInfo?.category_id)}
                            onChange={handleCategoryChange}
                            placeholder="Category"
                            styles={selectStyles}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-3">
                        <label className="text-sm font-medium text-gray-500 mb-2">Average Price</label>
                        <div className="flex items-center gap-4">
                            {PRICE_OPTIONS.map((priceOption) => (
                                <div key={priceOption}>
                                    <input
                                        type="radio"
                                        id={`price${priceOption}`}
                                        name="price"
                                        value={priceOption}
                                        className="hidden peer"
                                        onChange={handleInputChange}
                                        checked={Number(formState.videoInfo?.price) === priceOption}
                                    />
                                    <label
                                        htmlFor={`price${priceOption}`}
                                        className={`px-4 py-2 rounded-full cursor-pointer transition-all ${Number(formState.videoInfo?.price) === priceOption ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                                    >
                                        {'$'.repeat(priceOption)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-500 flex gap-1">
                            Thumbnail
                            <ReactTooltip id="thumbnail" content="Thumbnail that will appear on the video" />
                            <FaInfoCircle data-tooltip-id="thumbnail" />
                        </label>
                        <label
                            htmlFor="thumbnail"
                            className="justify-between rounded-2xl border py-3 px-4 outline-none flex items-center text-gray-500"
                        >
                            {formState.thumbnail || formState.videoInfo?.thumbnail ? (
                                <img
                                    src={formState.thumbnail?.target?.files[0]
                                        ? URL.createObjectURL(formState.thumbnail.target.files[0])
                                        : formState.videoInfo.thumbnail}
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
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-500 flex gap-1">
                            Description
                            <ReactTooltip id="description" content="Description about your video" />
                            <FaInfoCircle data-tooltip-id="description" />
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            className="text-lg font-medium rounded-2xl border py-2 px-4 outline-none"
                            placeholder="Description..."
                            value={formState.videoInfo?.description || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <div className={`flex items-center gap-8 ${isPayable && "border-b pb-4"}`}>
                    {isPayable && (
                        <span className="text-gray-700 font-bold text-3xl">${price}</span>
                    )}
                    {mode !== 'create' && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={formState.isLoading}
                            className="bg-yellow-500 py-4 px-12 text-white font-medium text-lg rounded-2xl disabled:opacity-50"
                        >
                            {formState.isLoading
                                ? "Processing..."
                                : "Delete"
                            }
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={formState.isLoading}
                        className="bg-primary py-4 px-12 text-white font-medium text-lg rounded-2xl disabled:opacity-50"
                    >
                        {formState.isLoading
                            ? "Processing..."
                            : mode === 'create'
                                ? (price > 0 ? "Pay Now" : "Publish Video")
                                : "Update"
                        }
                    </button>
                </div>
            </div>

            {isPayable && (
                <div className="flex items-center justify-end gap-4 text-gray-600">
                    <FaInfoCircle />
                    <span className="text-sm">
                        After payment you will be returned here immediately.
                    </span>
                </div>
            )}
        </form>
    );
};

export default VideoUploadForm;