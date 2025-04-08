import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { imageUrl } from "../../helper";
import moment from "moment";
import HoverPlayYouTube from "../Common/HoverPlayYoutube";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePrimary } from "../../context/PrimaryContext";
import Skeleton from "react-loading-skeleton";
import PromotionBadge from "../Common/PromotionBadge";

const CategoryVideo = ({className}) => {
    const navigate = useNavigate();
    const [catVideos, setCatVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const { state } = usePrimary();
    const [loading, setLoading] = useState(true);

    console.log(state.selectedLocation.value, "selectedLocation*****************");
    console.log(catVideos, "catVideos*****************");
    const fetchCategoryVideos = async (pageNum) => {
        try {
            const response = await axios.get("Main/getCategoryVideos", {
                params: {
                    page: pageNum,
                    location_id: state?.selectedLocation?.value ?? "",
                },
            });

            if (pageNum === 1) {
                setCatVideos(response?.data?.data);
            } else if (response?.data?.data) {
                setCatVideos((prevVideos) => [...prevVideos, ...response.data.data]);
            }
            setTotal(response.data.total);
            setHasMore(response.data.current_page < response.data.last_page);
        } catch (error) {
            setHasMore(false);
            // console.log(error);
            //   toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        fetchCategoryVideos(1).then(() => {
            setLoading(false);
        });
    }, [state.selectedLocation.value]);

    const fetchNextData = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchCategoryVideos(nextPage);
    };


    return (
        <section className={className}>
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
            ) : catVideos?.length > 0 ? (
                <div className="flex flex-col gap-5 mx-auto">
                    <InfiniteScroll
                        dataLength={catVideos?.length}
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
                        refreshFunction={() => fetchCategoryVideos(1)}
                        className="flex flex-col gap-5 mx-auto"
                    >
                        {catVideos?.map((item) => {
                            return (
                                <div key={item?.id}>
                                    <div className="flex flex-row justify-between gap-3 md:gap-0 ">
                                        <h2 className="text-[20px] md:text-[24px] font-medium font-Poppins text-[#000000]">{item?.title}</h2>

                                        <Link to={`/view-all/${item?.id}`}>
                                            <button className="flex items-center gap-3 text-secondery text-[14px] font-Roboto underline text-blue-700">
                                                Explore all
                                                <span>
                                                    <MdArrowForwardIos />
                                                </span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[14px] mt-[16px]">
                                        {item?.paginated_videos?.data?.length > 0 ? (
                                            item?.paginated_videos?.data?.map((video) => {
                                                return (
                                                    <div className="" key={video?.id}>
                                                        <div className="flex flex-col max-w-lg md:min-h-[238px] space-y-6 overflow-hidden rounded-lg pb-2 mx-auto">
                                                            <div>
                                                                <Link to={video?.slug}>
                                                                    <div className="relative z-10">
                                                                        {/* Image container with hover effect */}
                                                                        <div className="relative group">
                                                                            {/* <img src={imageUrl(video?.thumbnail?.default)} alt="popular photo" className="object-contain w-full mb-4 transition-transform duration-300 transform group-hover:scale-105 group-hover:opacity-70 group-hover:transform-origin-center" /> */}
                                                                            <HoverPlayYouTube videoUrl={video?.video} thumbnail={imageUrl(video?.thumbnail?.default)} />

                                                                            <div className="absolute inset-0 flex videos-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-[60%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                                                                                <p className="text-[#FFFFFF] text-3xl">
                                                                                    <IoMdPlay className="text-[#FFFFFF]" />
                                                                                </p>
                                                                            </div>

                                                                            <PromotionBadge video={video} />
                                                                        </div>
                                                                        {/* <span className="absolute z-20 bottom-0 right-0 m-2 px-2 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#333333]">17:08</span> */}
                                                                    </div>
                                                                </Link>

                                                                <div className="flex md:justify-between gap-4 md:gap-2 p-1">
                                                                    <img src={imageUrl(video.user.avatar.default)} alt="" className="w-[40px] h-[40px] object-cover rounded-full" />
                                                                    <div>
                                                                        <h1 className="font-Roboto text-[14px] text-[#333333]">{video?.title?.length > 50 ? `${video?.title.substring(0, 50)}...` : video?.title}</h1>
                                                                        <p className="font-Roboto text-[14px] text-[#666666]">{video?.user?.name}</p>
                                                                        <div className="flex items-center gap-3">
                                                                            <p className="font-Roboto text-[12px] text-[#666666]">
                                                                                <span>{video?.views}</span> views
                                                                            </p>
                                                                            <span className="h-2 w-2 bg-[#999999] rounded-full"></span>
                                                                            <p className="font-Roboto text-[12px] text-[#666666]">
                                                                                <span>{moment(video?.created_at).fromNow()}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-1 items-center justify-center w-full">
                                                <h5 className="text-gray-200 text-2xl">No videos found</h5>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </InfiniteScroll>
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center h-32 w-full">
                    <h1 className="text-gray-500 text-5xl">No Category found</h1>
                </div>
            )}
        </section>
    );
};

export default CategoryVideo;
