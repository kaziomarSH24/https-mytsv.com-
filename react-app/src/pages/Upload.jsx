import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoUploadForm from '../components/Dashboard/VideoUploadForm';

const Upload = () => {
    const { setPageTitle } = useOutletContext();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setPageTitle("Upload New Video 🥳");
        fetchFormData();
    }, []);

    const fetchFormData = async () => {
        try {
            const [categoriesRes, locationsRes] = await Promise.all([
                axios.get("Main/getCategories"),
                axios.get("Main/getLocations")
            ]);

            setCategories(categoriesRes.data.map(val => ({
                label: val.title,
                value: val.id
            })));

            setLocations(Object.keys(locationsRes.data).map(key => ({
                value: key,
                label: locationsRes.data[key],
            })));
        } catch (error) {
            toast.error("Failed to load form data");
        }
    };

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const form = new FormData();
            // Append all form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    form.append(key, formData[key]);
                }
            });

            await axios.post("Dashboard/Videos", form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Video uploaded successfully!");
            navigate("/User/Videos");
        } catch (error) {
            console.error(error, "Error uploading video");
            toast.error(error.response?.data?.message || "Failed to upload video");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VideoUploadForm
            onSubmit={handleSubmit}
            categories={categories}
            locations={locations}
            mode="create"
            isLoading={isLoading}
        />
    );
};

export default Upload;
