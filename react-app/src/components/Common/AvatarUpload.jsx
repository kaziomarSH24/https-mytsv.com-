import { useEffect, useState } from 'react';
import { FaUpload, FaTrash, FaCamera, FaSpinner } from 'react-icons/fa';
import { imageUrl } from '../../helper';

const AvatarUpload = ({ user, onAvatarChange, onAvatarDelete }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setPreviewUrl(user.avatar?.default)
    }, [user]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // File validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }

        try {
            setIsUploading(true);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await onAvatarChange(file);
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsUploading(true);
            const res = await onAvatarDelete();
            setPreviewUrl(res.data?.avatar?.default);
        } catch (err) {
            setError('Failed to delete image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar Preview */}
                    <div className="relative group">
                        <div className={`w-40 h-40 rounded-full overflow-hidden border-4 ${isUploading ? 'border-primary-light animate-pulse' : 'border-primary'
                            }`}>
                            {previewUrl ? (
                                <img
                                    src={imageUrl(previewUrl)}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <FaCamera className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <FaSpinner className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Hover Overlay */}
                        <label className="absolute cursor-pointer inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="p-3 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                                <FaUpload className="w-6 h-6 text-primary" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </div>
                        </label>
                    </div>

                    {/* User Info */}
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                            {user.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Update your photo and personal details
                        </p>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3 font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaUpload className="w-4 h-4" />
                        Upload New Picture
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>

                    <button
                        onClick={handleDelete}
                        disabled={isUploading || !previewUrl}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 font-medium text-primary border-2 border-primary hover:bg-red-50 rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaTrash className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-primary text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </>
    );
};

export default AvatarUpload;
