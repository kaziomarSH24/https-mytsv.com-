import { useEffect } from 'react';
import { usePrimary } from '../../context/PrimaryContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import UserSettingsForm from '../../components/Dashboard/UserSettingsForm';

const Settings = () => {
    const { setPageTitle } = useOutletContext();
    const { state, dispatch } = usePrimary();
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle('Settings');
    }, []);

    const handleSuccess = (updatedUser) => {
        dispatch({ type: "SET_USER", payload: updatedUser });
        navigate('/User/Profile');
    };

    return (
        <div className="mx-auto p-3 max-w-8xl">
            <UserSettingsForm
                endpoint="Dashboard/Settings"
                thumbnailEndpoint="Dashboard/Settings/Avatar"
                userInfo={state.user}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Settings;
