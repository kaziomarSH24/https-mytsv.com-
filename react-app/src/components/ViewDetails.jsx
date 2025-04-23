import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import HoverPlayYouTube from "./Common/HoverPlayYoutube";
import { imageUrl } from "../helper";
import moment from "moment";
import { IoMdPlay } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import { usePrimary } from "../context/PrimaryContext";
// import { shouldShowBadge } from "../helper";
import PromotionBadge from "./Common/PromotionBadge";
import { isNumber } from "chart.js/helpers";

const ViewDetails = ({ catId }) => {
    const { prms } = useParams();
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const { state } = usePrimary();
    const [loading, setLoading] = useState(true);

    let searchQuery = null;
    if(isNumber(catId) == false){
         searchQuery = catId;
    }
    
    const fetchVideos = async (pageNum = 1) => {
        setLoading(true);
        try {
            let response = null;
            if (prms === "promotion") {
                response = await axios.get("/Main/promoted-videos");
                response = response?.data;
            } else if (isNumber(catId) === false && searchQuery) {
                response = await axios.get("Main/getVideos", {
                    params: {
                        search: searchQuery,
                    },
                });
            }else {
                response = await axios.get("Main/category-video", {
                    params: {
                        category_id: prms ?? catId,
                        page: pageNum,

                        location_id: state?.selectedLocation?.value ?? "",
                    },
                });
                // console.log(response, "$$$$$$$$$$$$$$");
            }

            if (pageNum === 1) {
                setVideos(response?.data?.data || []);
            } else if (response?.data?.data) {
                setVideos((prevVideos) => [...prevVideos, ...response.data.data]);
            }

            setTotal(response.data.total);
            setHasMore(response.data.current_page < response.data.last_page);
        } catch (error) {
            setHasMore(false);
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchVideos(1).then(() => {
            setLoading(false);
        });
    }, [prms, state.selectedLocation.value, catId]);

    const fetchNextData = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchVideos(nextPage);
    };

    return (
        <div className="max-w-[1167px] mx-auto mt-10 px-4 pb-[40px] lg:pb-[64px]">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[14px] mt-[16px]">
                    {Array(4)
                        .fill()
                        .map((_, key) => (
                            <div className="flex flex-col gap-2" key={key}>
                                <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                            </div>
                        ))}
                </div>
            ) : videos?.length > 0 ? (
                <InfiniteScroll
                    dataLength={videos?.length}
                    next={fetchNextData}
                    hasMore={hasMore}
                    loader={Array(4)
                        .fill()
                        .map((_, key) => (
                            <div className="flex flex-col gap-2" key={key}>
                                <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                            </div>
                        ))}
                    refreshFunction={() => fetchVideos(1)}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[14px] mt-[16px]"
                >
                    {videos.map((video) => (
                        <div className="" key={video?.id}>
                            <div className="">
                                <div className="flex flex-col max-w-lg md:min-h-[238px] space-y-6 overflow-hidden rounded-lg pb-2">
                                    <div>
                                        <Link to={`/${video?.slug}`}>
                                            <div className="relative z-10">
                                                <div className="relative group">
                                                    <HoverPlayYouTube height={250} videoUrl={video.video} thumbnail={imageUrl(video.thumbnail.default)} />
                                                    <div className="absolute inset-0 left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[40px] h-[40px] opacity-0 rounded-lg group-hover:opacity-100 transition-opacity duration-300">
                                                        <a href="#" className="text-[#FFFFFF] text-3xl">
                                                            <IoMdPlay className="text-[#FFFFFF]" />
                                                        </a>
                                                    </div>
                                                    <PromotionBadge video={video} />
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex justify-between gap-2 p-1">
                                            <img src={imageUrl(video.user.avatar.default)} alt="" className="w-[40px] h-[40px] object-cover rounded-full" />
                                            <div>
                                                <h1 className="font-Roboto text-[14px] text-[#333333]">{video?.title?.length > 50 ? `${video?.title?.substring(0, 50)}...` : video?.title}</h1>
                                                <p className="font-Roboto text-[14px] text-[#666666]">{video?.user.name}</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="font-Roboto text-[12px] text-[#666666]">
                                                        <span>{video.views}</span> views
                                                    </p>
                                                    <span className="h-2 w-2 bg-[#999999] rounded-full"></span>
                                                    <p className="font-Roboto text-[12px] text-[#666666]">
                                                        <span>{moment(video.created_at).fromNow()}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="flex flex-1 items-center justify-center h-32 w-full">
                    <h1 className="text-gray-200 text-5xl">No videos found</h1>
                </div>
            )}
        </div>
    );
};

export default ViewDetails;
