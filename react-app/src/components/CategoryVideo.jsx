import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { imageUrl } from "../helper";
import moment from "moment";
import HoverPlayYouTube from "./Common/HoverPlayYoutube";

const CategoryVideo = () => {
    const navigate = useNavigate();
    const [catVideos, setCatVideos] = useState([]);

    useEffect(() => {
        const fetchCategoryVideos = async () => {
            try {
                const response = await axios.get("Main/getCategoryVideos");

                setCatVideos(response.data.data);
            } catch (error) {
                toast.error("Error fetching categories & videos");
            }
        };
        fetchCategoryVideos();
    }, []);

    const handleExploreMostPopular = () => {
        navigate("/view-all");
    };

    const categorieData = catVideos.map((item) => item.title);
    const videoTitle = categorieData.map((item) => item);
    const categries = videoTitle;
    categries.map((item) => console.log(item));

    return (
        <section className="container mx-auto px-4 mt-8 md:mt-20 pb-[64px] ">
            {catVideos.length > 0 && (
                <div className="flex flex-col gap-5">
                    {catVideos?.map((item) => {
                                return (
                                    <>
                                        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0">
                                            <h2 className="text-[20px] md:text-[24px] font-medium font-Poppins text-[#000000]">{item.title}</h2>

                                            <Link to={`/view-all/${item.id}`}>
                                            <button className="flex items-center gap-3 text-secondery text-[14px] font-Roboto underline text-blue-700">
                                                Explore all
                                                <span>
                                                    <MdArrowForwardIos />
                                                </span>
                                            </button>
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[14px] mt-[16px]">
                                            {item?.paginated_videos?.data?.map((video) => {
                                                return (
                                                    <Link to={"/view-details"} key={video?.id}>
                                                        <div className="">
                                                            <div className="flex flex-col max-w-lg md:min-h-[238px] space-y-6 overflow-hidden rounded-lg pb-2">
                                                                <div>
                                                                    <Link to={video?.slug}>
                                                                        <div className="relative z-10">
                                                                            {/* Image container with hover effect */}
                                                                            <div className="relative group">
                                                                                {/* <img src={imageUrl(video?.thumbnail?.default)} alt="popular photo" className="object-contain w-full mb-4 transition-transform duration-300 transform group-hover:scale-105 group-hover:opacity-70 group-hover:transform-origin-center" /> */}
                                                                                <HoverPlayYouTube height={210} videoUrl={video?.video} thumbnail={imageUrl(video?.thumbnail?.default)} />

                                                                                <div className="absolute inset-0 flex videos-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-[60%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
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
                                                                            <h1 className="font-Roboto text-[14px] text-[#333333]">{video.title.length > 50 ? `${video.title.substring(0, 50)}...` : video.title}</h1>
                                                                            <p className="font-Roboto text-[14px] text-[#666666]">{video.user?.name}</p>
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
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </>
                                );
                            })}
                </div>
            )}
        </section>
    );
};

export default CategoryVideo;
