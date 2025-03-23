import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import SmartVideosList from "../../components/Dashboard/SmartVideoList";

const VideosPage = () => {
    const { setPageTitle } = useOutletContext();

    useEffect(() => {
        setPageTitle("My Videos");
    }, [setPageTitle]);


    return (
        <SmartVideosList />
    );
};

export default VideosPage;
