import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoBox from "../components/Common/VideoBox";
import { Autoplay, EffectFade, Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { imageUrl } from "../helper";
import { toast } from "react-toastify";

const Home = () => {
    const [sliderVideos, setSliderVideos] = useState([]);
    const [popularVideos, setPopularVideos] = useState([]);
    const [catVideos, setCatVideos] = useState([]);
    const [recommendedVideos, setRecommendedVideos] = useState({ data: [], total: 0 });

    const fetchPopular = async () => {
        try {
            const response = await axios.get("Main/getVideos", {
                params: { order: 'popular' },
            });
            setPopularVideos(response.data);
            setSliderVideos(response.data);
            // console.log(response.data.data, "response.data");
        } catch (error) {
            toast.error('Caught Error');
        }
    };

    const catVideo = async () => {
        try {
            const response = await axios.get("Main/getCategoryVideos");
            setCatVideos(response.data);
            console.log(response, "response.data+++++++++++++");
        } catch (error) {
            toast.error('Caught Error');
        }
    };

    console.log(catVideos, "catVideos");

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
        catVideo();
        fetchRecommended(1);
    }, []);

    return (
        <>
            <Swiper
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                effect="fade"
                modules={[Autoplay, EffectFade]}
            >
                {sliderVideos?.data ? (
                    sliderVideos.data?.map((video) => (
                        <SwiperSlide key={video.id}>
                            <section className="relative pt-8 pb-28 md:pt-16 md:pb-32">
                                <picture>
                                    <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                    <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                    <img
                                        loading="lazy"
                                        src={imageUrl(video.thumbnail?.default)}
                                        className="absolute top-0 w-full h-full object-cover"
                                        alt={video.title}
                                    />
                                </picture>
                                <div className="relative text-white container">
                                    <div className="w-full max-w-[450px] p-2">
                                        <h4 className="flex items-center text-lg md:text-3xl">
                                            <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{video?.category?.title}</span>
                                            <span className="ml-5 py-[4px] px-[12px] text-xs font-semibold rounded-[4px] bg-[#c70b0d] shadow-lg">Ads</span>
                                        </h4>
                                        <h1 className="my-3 text-2xl font-semibold md:font-bold md:text-5xl md:leading-tight text-white opacity-95 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                            {video.title}
                                        </h1>
                                        <Link to={`/${video?.slug}`}>
                                            <img src={"/assets/img/PlayIcon.webp"} width={50} height={50} alt="Play Icon" className="w-full inline md:max-w-[100px] max-w-[45px]" />
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </SwiperSlide>
                    ))
                ) : (
                    <Skeleton className="rounded-2xl sm:h-[30rem] h-[19rem] -top-2" />
                )}
            </Swiper>

            <div className="sm:container">
                <div className="relative z-10 mb-16 pb-10 shadow-[0px_0px_14px_0px_rgba(0,0,0,0.25)] bg-white -mt-24 sm:rounded-3xl sm:pt-8 sm:px-10">
                    <h2 className="flex items-center justify-between px-4 mb-6 text-lg font-medium sm:mb-8 sm:block sm:px-0 sm:text-4xl sm:font-normal">
                        Most Popular
                        <Link to={""} className="ml-4 text-sm font-normal text-primary">View All Videos</Link>
                    </h2>

                    <div className="mb-5">
                        <Swiper
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            pagination={{ el: ".swip-pagination" }}
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                        >
                            {popularVideos?.data?.length > 0 ? (
                                popularVideos.data.map((video) => (
                                    <SwiperSlide key={video.id}>
                                        <VideoBox info={video} />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {Array(4).fill().map((_, key) => (
                                        <div className="flex flex-col gap-2" key={key}>
                                            <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                            <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Swiper>
                        <span className="flex justify-center mt-6 swip-pagination fill-primary"></span>
                    </div>

                    <h2 className="flex items-center justify-between px-4 mb-6 text-lg font-medium sm:mb-8 sm:block sm:px-0 sm:text-4xl sm:font-normal">
                        Recommended
                        <Link to={""} className="ml-4 text-sm font-normal text-primary">View All Videos</Link>
                    </h2>
                    {recommendedVideos?.data?.length > 0 ? (
                        <InfiniteScroll
                            dataLength={recommendedVideos.data.length}
                            next={fetchNextData}
                            hasMore={recommendedVideos.total > recommendedVideos.data.length}
                            loader={Array(4).fill().map((_, key) => (
                                <div className="flex flex-col gap-2" key={key}>
                                    <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                    <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                                </div>
                            ))}
                            refreshFunction={fetchRecommended}
                            className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {recommendedVideos.data.map((video, key) => (
                                <VideoBox info={video} key={key} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array(8).fill().map((_, key) => (
                                <div className="flex flex-col gap-2" key={key}>
                                    <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                    <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
