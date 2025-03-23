import { useNavigate, useParams } from 'react-router-dom';
import UserSettingsForm from '../../../../components/Dashboard/UserSettingsForm';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Users = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [userInfo, setUserInfo] = useState({});

    const handleSuccess = () => {
        navigate('/Admin/Users');
    };

    useEffect(() => {
        const getUser = async () => {
            if (params.id) {
                try {
                    const res = await axios.get(`/Dashboard/Admin/Users/${params.id}`);
                    setUserInfo(res?.data);
                } catch (e) {
                    toast.error(e.response?.data?.message);
                }
            }
        };

        getUser();
    }, [params.id]);

    return (
        <div className="mx-auto p-3 max-w-8xl">
            <UserSettingsForm
                endpoint="/Dashboard/Admin/Users"
                userInfo={userInfo}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Users;
