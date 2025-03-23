import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaTrash, } from 'react-icons/fa';
import CreatableSelect from 'react-select/creatable';
import AvatarUpload from '../Common/AvatarUpload';

const UserSettingsForm = ({ endpoint, userInfo, onSuccess }) => {
    console.log('end point', endpoint);
    const [user, setUser] = useState({});
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        if (userInfo) {
            setUser(userInfo);
            setSkills(userInfo.additional_info?.skills ?? []);
            setLanguages(userInfo.additional_info?.languages ?? []);
            setEducations(userInfo.additional_info?.educations ?? []);
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            additional_info: {
                skills,
                languages,
                educations,
                bio: user.additional_info?.bio,
            },
            id: user.id,
            name: user.name,
            full_name: user.full_name,
            email: user.email,
            avatar: user.avatar,
            phone_number: user.phone_number,
        };

        try {
            const res = await axios.post(endpoint, data);
            setUser(res.data);
            toast.success('Successfully updated profile.');
            if (onSuccess) onSuccess(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${endpoint}/${user.id}`);
            toast.success('Successfully deleted.');
            if (onSuccess) onSuccess(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };
    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '1rem',
            padding: '0.3rem 0.5rem',
            border: '2px solid #E5E7EB',
            boxShadow: 'none',
            '&:hover': {
                border: '2px solid #E5E7EB',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6B7280',
        }),
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className='mb-8 border-b pb-6'>
                <AvatarUpload
                    user={user}
                    onAvatarChange={async (avatar) => {
                        await axios.post(endpoint, { ...user, avatar }, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        });
                    }}
                    onAvatarDelete={async () => {
                        return await axios.post(endpoint, { ...user, avatar: null });
                    }}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    name="name"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                    placeholder="Channel Name"
                    value={user?.name || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="full_name"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                    placeholder="Full Name"
                    value={user?.full_name || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="email"
                    name="email"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                    placeholder="Email"
                    value={user?.email || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phone_number"
                    className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                    placeholder="Phone Number"
                    value={user?.phone_number || ''}
                    onChange={handleInputChange}
                />
            </div>
            <CreatableSelect
                isMulti
                isClearable
                value={educations.map(edu => ({ value: edu, label: edu }))}
                onChange={(selectedOptions) => setEducations(selectedOptions.map(option => option.value))}
                placeholder="Education"
                styles={customSelectStyles}
            />
            <CreatableSelect
                isMulti
                isClearable
                value={languages.map(lang => ({ value: lang, label: lang }))}
                onChange={(selectedOptions) => setLanguages(selectedOptions.map(option => option.value))}
                placeholder="Languages"
                styles={customSelectStyles}
            />
            <CreatableSelect
                isMulti
                isClearable
                value={skills.map(skill => ({ value: skill, label: skill }))}
                onChange={(selectedOptions) => setSkills(selectedOptions.map(option => option.value))}
                placeholder="Skills"
                styles={customSelectStyles}
            />
            <textarea
                name="bio"
                rows="4"
                className="w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                placeholder="Bio"
                value={user.additional_info?.bio || ''}
                onChange={(e) => setUser({ ...user, additional_info: { ...user.additional_info, bio: e.target.value } })}
            ></textarea>
            <div className="flex gap-10 justify-center">
                <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium text-white border-2 bg-primary hover:bg-primary-dark rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaTrash />
                    Delete Profile
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium  text-white border-2 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaSave />
                    Save Profile
                </button>
            </div>
        </form>
    );
};

export default UserSettingsForm;
