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

const ViewDetails = ({ catId }) => {
    const { id } = useParams();
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const { state } = usePrimary();

    console.log(state.selectedLocation.value, "selectedLocation*****************");

    const fetchVideos = async (pageNum = 1) => {
        try {
            const response = await axios.get("Main/category-video", {
                params: {
                    category_id: id ?? catId,
                    page: pageNum,
                    location_id: state?.selectedLocation?.value ?? "",
                },
            });

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
        fetchVideos(1);
    }, [id, state.selectedLocation.value]);

    const fetchNextData = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchVideos(nextPage);
    };

    return (
        <>
            {/* <div className="bg-gray-800 sm:pt-10 sm:pb-20 pattern">
                <div className="sm:container">
                    <h2 className="text-white sm:text-5xl text-3xl font-semibold px-2">{videos[0]?.category?.title ?? <Skeleton baseColor="#475569" borderRadius={30} width={250} height={50} />}</h2>
                </div>
            </div> */}
            <div className="max-w-[1167px] mx-auto mt-10 px-4 pb-[40px] lg:pb-[64px]">
                {/* all data show */}
                {videos.length > 0 ? (
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
                            <Link to={video.slug} key={video.id}>
                                <div className="">
                                    <div className="">
                                        <div className="flex flex-col max-w-lg md:min-h-[238px] space-y-6 overflow-hidden rounded-lg pb-2">
                                            <div>
                                                <Link to={`/${video?.slug}`}>
                                                    <div className="relative z-10">
                                                        {/* Image container with hover effect */}
                                                        <div className="relative group">
                                                            {/* <img src={imageUrl(video.thumbnail.default)} alt="popular photo" className="object-contain w-full mb-4 transition-transform duration-300 transform group-hover:scale-105 group-hover:opacity-70 group-hover:transform-origin-center" /> */}
                                                            <HoverPlayYouTube height={250} videoUrl={video.video} thumbnail={imageUrl(video.thumbnail.default)} />
                                                            {/* Home Icon in the middle */}
                                                            <div className="absolute inset-0 left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[40px] h-[40px] opacity-0 rounded-lg group-hover:opacity-100 transition-opacity duration-300   ">
                                                                <a href="#" className="text-[#FFFFFF] text-3xl">
                                                                    <IoMdPlay className="text-[#FFFFFF]" />
                                                                </a>
                                                            </div>

                                                            <div className="absolute top-0 right-0 z-30 m-2 px-4 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#FFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">Paid</div>
                                                        </div>
                                                        {/* <span className="absolute z-20 bottom-0 right-0 m-2 px-2 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#333333]">17:08</span> */}
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
                            </Link>
                        ))
                    }
                </InfiniteScroll>
                ) : (
                    <div className="flex flex-1 items-center justify-center h-32 w-full">
                        <h1 className="text-gray-500 text-5xl">No videos found</h1>
                    </div>
                    )}
            </div>
        </>
    );
};

export default ViewDetails;
