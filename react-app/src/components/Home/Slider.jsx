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
import { Autoplay, Pagination } from "swiper/modules";
import axios from "axios";
import { imageUrl } from "../../helper";
import { toast } from "react-toastify";

const Slider = () => {
    const [sliderVideos, setSliderVideos] = useState([]);

    const fetchPopular = async () => {
        try {
            const response = await axios.get("Main/getVideos", {
                params: { order: "popular" },
            });
            setSliderVideos(response.data);
        } catch (error) {
            toast.error("Caught Error");
        }
    };

    useEffect(() => {
        fetchPopular();
    }, []);
console.log(sliderVideos, "sliderVideos 33");
    return (
        <>
            <Swiper
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    activeClass: "pagination-active", //active class add
                }}
                loop={true}
                speed={1000}
                effect="slide"
                modules={[Autoplay, Pagination]}
                className="max-w-[1167px] mx-auto"
            >
                {sliderVideos?.data ? (
                    sliderVideos.data?.map((video) => (
                        <SwiperSlide className="" key={video.id}>
                            <div className="h-[40vh] md:h-[55vh] lg:h-[348px] flex items-center rounded" style={{ backgroundImage: `url(${imageUrl(video.thumbnail?.default)})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                                <div className="container relative z-10">
                                    <div className="flex items-center ">
                                        <div className="lg:ml-10 max-w-[550px] text-[#FFFFFF] pl-8 py-8">
                                            <h1 className="font-Roboto text-base md:text-2xl hidden sm:block">
                                                {video?.category?.title} <span className="bg-primary text-[#FFFFFF] px-2 py-1 rounded ml-[8px]">Ads</span>
                                            </h1>

                                            <p className="font-Poppins font-medium py-[16px] hidden sm:text-xl sm:block lg:text-4xl">{video.title.length > 50 ? `${video.title.substring(0, 50)}...` : video.title}</p>
                                        </div>
                                        <div className="absolute left-[50%] sm:left-0 sm:right-[20%] transform translate-x-[-50%]">
                                            <Link to={`/${video?.slug}`}>
                                                <img src={"/assets/img/PlayIcon.webp"} alt="Play Icon" className="w-full inline md:max-w-[100px] max-w-[45px]" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <Skeleton className="h-[40vh] md:h-[55vh] lg:h-[348px] flex items-center rounded" />
                )}
            </Swiper>
        </>
    );
};

export default Slider;
