import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../../../usbek-website/src/components/slider/Slider.css";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { imageUrl } from "../../helper";
import { toast } from "react-toastify";

const Slider = () => {
    const [sliderVideos, setSliderVideos] = useState([]);
    const [popularVideos, setPopularVideos] = useState([]);
    // const [catVideos, setCatVideos] = useState([]);
    const [recommendedVideos, setRecommendedVideos] = useState({ data: [], total: 0 });

    const fetchPopular = async () => {
        try {
            const response = await axios.get("Main/getVideos", {
                params: { order: "popular" },
            });
            setPopularVideos(response.data);
            setSliderVideos(response.data);
            // console.log(response.data.data, "response.data");
        } catch (error) {
            toast.error("Caught Error");
        }
    };

    // const catVideo = async () => {
    //     try {
    //         const response = await axios.get("Main/getCategoryVideos");
    //         setCatVideos(response.data);
    //         console.log(response, "response.data+++++++++++++");
    //     } catch (error) {
    //         toast.error("Caught Error");
    //     }
    // };

    // console.log(catVideos, "catVideos");

    const fetchRecommended = async (page = 1) => {
        const recommendedTags = JSON.parse(localStorage.getItem("recommendedTags")) || [];
        try {
            const response = await axios.get("Main/getVideos", {
                params: { tag: recommendedTags, paginate: 4, page },
            });
            setRecommendedVideos((prevState) => ({
                data: [...prevState.data, ...(response.data?.data || [])],
                total: response.data?.total || prevState.total,
            }));
        } catch (error) {
            toast.error("Failed to fetch recommended videos.....");
        }
    };

    const fetchNextData = async () => {
        const nextPage = Math.ceil(recommendedVideos.data.length / 4) + 1;
        await fetchRecommended(nextPage);
        return recommendedVideos;
    };

    useEffect(() => {
        fetchPopular();
        // catVideo();
        fetchRecommended(1);
    }, []);

    return (
        <>
            <Swiper
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    activeClass: "pagination-active", //active class add
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="max-w-[1167px] mx-auto"
            >
                {sliderVideos?.data ? (
                    sliderVideos.data?.map((video) => (
                        <SwiperSlide className="" key={video.id}>
                            <div className="h-[40vh] md:h-[55vh] lg:h-[348px] flex items-center rounded" style={{ backgroundImage: `url(${imageUrl(video.thumbnail?.default)})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                                <div className="container relative z-10">
                                    <div className="lg:ml-10 max-w-[500px] text-[#FFFFFF] pl-8 py-8">
                                        <h1 className="font-Roboto text-base md:text-2xl">
                                            {video?.category?.title} <span className="bg-primary text-[#FFFFFF] px-2 py-1 rounded ml-[8px]">Ads</span>
                                        </h1>

                                        <p className="font-Poppins font-medium py-[16px] text-xl lg:text-5xl">{video.title}</p>
                                        <Link to={`/${video?.slug}`}>
                                        <img src={"/assets/img/PlayIcon.webp"} alt="Play Icon" className="w-full inline md:max-w-[100px] max-w-[45px]" />
                                            {/* <div className="flex items-center gap-2">
                                                <span>
                                                    <svg width="58" height="59" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <mask id="mask0_55_2124" maskUnits="userSpaceOnUse" x="2" y="2" width="24" height="25">
                                                            <rect x="2" y="2.5" width="24" height="24" fill="#D9D9D9" />
                                                        </mask>
                                                        <g mask="url(#mask0_55_2124)">
                                                            <path
                                                                d="M11.5 19L18.5 14.5L11.5 10V19ZM14 24.5C12.6167 24.5 11.3167 24.2375 10.1 23.7125C8.88333 23.1875 7.825 22.475 6.925 21.575C6.025 20.675 5.3125 19.6167 4.7875 18.4C4.2625 17.1833 4 15.8833 4 14.5C4 13.1167 4.2625 11.8167 4.7875 10.6C5.3125 9.38333 6.025 8.325 6.925 7.425C7.825 6.525 8.88333 5.8125 10.1 5.2875C11.3167 4.7625 12.6167 4.5 14 4.5C15.3833 4.5 16.6833 4.7625 17.9 5.2875C19.1167 5.8125 20.175 6.525 21.075 7.425C21.975 8.325 22.6875 9.38333 23.2125 10.6C23.7375 11.8167 24 13.1167 24 14.5C24 15.8833 23.7375 17.1833 23.2125 18.4C22.6875 19.6167 21.975 20.675 21.075 21.575C20.175 22.475 19.1167 23.1875 17.9 23.7125C16.6833 24.2375 15.3833 24.5 14 24.5Z"
                                                                fill="#FF4D4D"
                                                            />
                                                        </g>
                                                        <circle cx="14" cy="14.5" r="11.875" stroke="#2a2521" strokeWidth="0.25" />
                                                        <circle cx="14" cy="14.5" r="13.875" stroke="#2a2521" strokeWidth="0.25" />
                                                    </svg>
                                                </span>
                                                <p className="font-Roboto text-[16px]">Play</p>
                                            </div> */}

                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <Skeleton className="rounded-2xl sm:h-[30rem] h-[19rem] -top-2" />
                )}
            </Swiper>
            </>
    );
};

export default Slider;
