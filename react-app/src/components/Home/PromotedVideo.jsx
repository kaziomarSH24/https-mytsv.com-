import { Link } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import HoverPlayYouTube from "../Common/HoverPlayYoutube";
import { imageUrl } from "../../helper";
import moment from "moment";
import PromotionBadge from "../Common/PromotionBadge";

const PromotedVideo = ({ videos, title = "Promotional Video", className }) => {
    return (
        <section className={className}>
            <div className="flex flex-col gap-5 mx-auto">
                <div>
                    <div className="flex flex-row justify-between gap-3 md:gap-0">
                        <h2 className="text-[20px] md:text-[24px] font-medium font-Poppins text-[#000000]">{title}</h2>

                        <Link to={`/view-all/promotion`}>
                            <button className="flex items-center gap-3 text-secondery text-[14px] font-Roboto underline text-blue-700">
                                Explore all
                                <span>
                                    <MdArrowForwardIos />
                                </span>
                            </button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[14px] mt-[16px]">
                        {videos && videos.length > 0 ? (
                            videos.map((video) => (
                                <div className="" key={video?.id}>
                                    <div className="flex flex-col max-w-lg md:min-h-[238px] space-y-6 overflow-hidden rounded-lg pb-2 mx-auto">
                                        <div>
                                            <Link to={video?.slug}>
                                                <div className="relative z-10">
                                                    {/* Image container with hover effect */}
                                                    <div className="relative group">
                                                        <HoverPlayYouTube videoUrl={video?.video} thumbnail={imageUrl(video?.thumbnail?.default)} />

                                                        <div className="absolute inset-0 flex videos-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-[60%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                                                            <p className="text-[#FFFFFF] text-3xl">
                                                                <IoMdPlay className="text-[#FFFFFF]" />
                                                            </p>
                                                        </div>

                                                        <PromotionBadge video={video} />
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="flex md:justify-between gap-4 md:gap-2 p-1">
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
                            ))
                        ) : (
                            <div className="flex flex-1 items-center justify-center w-full col-span-4">
                                <h5 className="text-gray-400 text-2xl">No promoted videos found</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotedVideo;
