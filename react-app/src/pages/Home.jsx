import CategoryVideo from "../components/Home/CategoryVideo";
import Slider from "../components/Home/Slider";
import PromotedVideo from "../components/Home/PromotedVideo";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Home = () => {
    const [promotedVideos, setPromotedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchPromotedVideos = useCallback(async () => {
        try {
            const response = await axios.get("/Main/promoted-videos");
            if (response?.data?.success && response?.data?.data?.data?.length > 0) {
                // console.log(response.data.data.data, "response.data.data.data");
                setPromotedVideos(response.data.data.data);
            }
        } catch (error) {
            console.error("Error fetching promoted videos", error);
        } finally {
            setLoading(false);
        }
    }, [setPromotedVideos, setLoading]);

    useEffect(() => {
        fetchPromotedVideos();
    }, [fetchPromotedVideos]);
    return (
        <>
            <Slider />
            {!loading && promotedVideos?.length > 0 && (
                <PromotedVideo videos={promotedVideos} className={`max-w-[1167px] mx-auto px-4 mt-8 md:mt-20`}/>
            )}
            <CategoryVideo className={`${!loading && promotedVideos?.length > 0 ? 'max-w-[1167px] mx-auto px-4 md:mt-3 pb-[64px]' : 'max-w-[1167px] mx-auto px-4 mt-8 md:mt-20 pb-[64px]'}`} />
        </>
    );
};

export default Home;
