import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Graph from "../../components/Analytics/Graph";
import VideoBox from "../../components/Common/VideoBox";
import { useOutletContext } from "react-router-dom";

const AnalyticsPage = () => {
    const { setPageTitle } = useOutletContext();

    useEffect(() => {
        setPageTitle("Analytics");
    }, [setPageTitle]);

    const [videos, setVideos] = useState([]);

    const fetchVideos = async () => {
        try {
            const response = await axios.get("Dashboard/MyVideos");
            setVideos(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Caught error");
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);
    return (
        <>
            <div className="flex justify-between gap-6 md:flex-row flex-col">
                <Graph />
            </div>
            <div className="mt-16">
                <h2 className="text-center text-black text-[40px] font-light mb-8">Your top content in this period</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos?.map((video) => (
                        <VideoBox key={video?.id} info={video} hidePlayBtn={true} analytics={true} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AnalyticsPage;
