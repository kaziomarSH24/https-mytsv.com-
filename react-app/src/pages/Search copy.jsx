import "swiper/css";
import axios from "axios";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoBox from "../components/Common/VideoBox";
import { Autoplay, EffectFade } from "swiper/modules";
import { BiSearch, BiSortDown, BiSortUp } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { usePrimary } from "../context/PrimaryContext";
import { imageUrl } from "../helper";
import { MdLocationOff } from "react-icons/md";

const SearchCopy = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sliderVideos, setSliderVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("popular");
    const [sortLocation, setSortLocation] = useState(true);

    const { query } = useParams();
    const { state } = usePrimary();
    console.log(state.location.city, "state*****************");
    const getVideos = async () => {
        setLoading(true);
        const res = await axios.get("Main/getVideos", {
            search: query,
            order: sortOrder,
            location: sortLocation,
        });
        setVideos(res.data);
        setSliderVideos(res.data);
        setLoading(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        getVideos(searchQuery, sortOrder);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "popular" ? "new" : "popular");
    };
    const toggleSortLocation = () => {
        setSortLocation(!sortLocation);
    };
    useEffect(() => {
        setSearchQuery(query)
        getVideos(query, "asc");
    }, [query, sortOrder, sortLocation]);


    return (
        <>
            <Swiper
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                effect={"fade"}
                modules={[Autoplay, EffectFade]}
            >
                {sliderVideos?.total > 0 ? (
                    sliderVideos?.data?.map((video) => (
                        <SwiperSlide key={video.id}>
                            <section className="md:pt-16 pt-8 md:pb-32 pb-28">
                                <picture>
                                    <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                    <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                    <img src={imageUrl(video.thumbnail?.default)}
                                        className="absolute w-full h-full top-0 object-cover" alt={video.title} />
                                </picture>
                                <div className="container text-white relative">
                                    <div className="w-[100%] max-w-[450px]">
                                    <h4 className="md:text-3xl text-lg flex items-center">
                                            <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{video?.category?.title}</span>
                                            <span className="text-xs bg-[#c70b0d] font-italic rounded-[4px] py-[4px] px-[12px] ml-5 font-semibold shadow-lg">Ads</span>
                                        </h4>
                                        <h1 className="md:text-5xl text-2xl font-semibold md:font-bold my-3 md:leading-tight opacity-95 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] line-clamp-2">{video.title}</h1>
                                        <Link to={`/${video?.slug}`}>
                                            <img src={"/assets/img/PlayIcon.webp"} alt="Play Icon" className="inline w-full md:max-w-[100px] max-w-[45px]" />
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
                <div className="relative shadow-[0px_0px_14px_0px_rgba(0,0,0,0.25)] sm:pt-6 pt-4 sm:rounded-3xl sm:px-10 -mt-24 mb-16 z-10 bg-white pb-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border-b px-4 mb-6 pb-3">
                        <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                className="px-4 py-2 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-primary text-white px-4 py-3 rounded-r-lg hover:bg-primary-light transition-colors">
                                <BiSearch />
                            </button>
                        </form>
                        <div className="flex items-center gap-6">
                            <button
                                className={`font-medium text-lg flex items-center gap-2 transition-colors ${sortOrder === "desc" ? 'text-primary' : 'text-gray-500 hover:text-primary'
                                    }`}
                                onClick={toggleSortOrder}
                            >
                                {sortOrder === "popular" ? (
                                    <>
                                        Sort Popular
                                        <BiSortUp />
                                    </>
                                ) : (
                                    <>
                                        Sort Latest
                                        <BiSortDown />
                                    </>
                                )}
                            </button>
                            <button onClick={toggleSortLocation} className="font-medium text-lg flex items-center gap-2 text-primary">
                                {sortLocation ? (
                                    <>
                                        {state.location ? (
                                            state.location.state,
                                            state.location.city
                                        ) : 'USA'}
                                        <IoLocationSharp />
                                    </>
                                ) : (
                                    <>
                                        All
                                        <MdLocationOff />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                        {loading ? (
                            <>
                                {Array(4)
                                    .fill()
                                    .map((_, key) => (
                                        <div className="flex flex-col gap-2" key={key}>
                                            <Skeleton height={200} borderRadius={15} className="rounded-2xl" />
                                            <Skeleton height={40} borderRadius={15} className="rounded-2xl" />
                                        </div>
                                    ))}
                            </>
                        ) : videos?.total > 0 ? (
                            videos?.data?.map((video, key) => <VideoBox info={video} key={key} />)
                        ) : (
                            <>
                                <h1 className="text-center mt-4 mb-4 items-center font-medium text-4xl col-span-8 text-primary">Videos not found</h1>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchCopy;
