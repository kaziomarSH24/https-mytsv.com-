import moment from "moment";
import NumberFormatter from "./FormatNumber";
import { Link } from "react-router-dom";
import { IoIosPlay } from "react-icons/io";
import { imageUrl } from "../../helper";

const VideoBox = ({ info }) => {
    return (
        <>
            <div className="relative group">
                {/* Dollar Sign Overlay */}
                <Link to={`/${info.slug}`}>
                    <span className="py-3 w-12 flex items-center justify-center absolute right-2 top-2 bg-primary text-white rounded-full z-10 tracking-widest font-semibold text-xl group-hover:opacity-0">
                        {Array(info?.price)
                            .fill("$")
                            .map((e, index) => (
                                <span key={index}>{e}</span>
                            ))}
                    </span>
                </Link>

                {/* Video Thumbnail with Hover Animation */}
                <Link to={`/${info.slug}`}>
                    <div className="relative w-full h-36 sm:h-40 md:h-52 overflow-hidden shadow sm:rounded-xl mb-2">
                        <picture>
                            <source media="(max-width: 767px)" srcSet={imageUrl(info.thumbnail?.mobile)} />
                            <source media="(max-width: 1023px)" srcSet={imageUrl(info.thumbnail?.tablet)} />
                            <img
                                loading="lazy"
                                src={imageUrl(info.thumbnail?.default)}
                                width={400}
                                height={250}
                                className="object-cover w-full h-full group-hover:opacity-40 transition-all duration-200"
                            />
                        </picture>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-white text-5xl">
                                <IoIosPlay className="bg-primary p-2 rounded-full" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Video Info */}
                <div className="flex items-center gap-3 mx-2 sm:mx-0 relative">
                    <picture>
                        <source media="(max-width: 767px)" srcSet={imageUrl(info.user?.avatar?.mobile)} />
                        <source media="(max-width: 1023px)" srcSet={imageUrl(info.user?.avatar?.tablet)} />
                        <img
                            loading="lazy"
                            src={imageUrl(info.user?.avatar?.default)}
                            width={400}
                            height={250}
                            className="rounded-full w-10 h-10 object-cover"
                            alt={info.user?.name}
                        />
                    </picture>
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-md text-[#232323] font-semibold line-clamp-2">
                            <Link to={`/${info.slug}`}>{info.title}</Link>
                        </h2>
                        <span className="text-xs">{info.user?.name}</span>
                        <span className="text-xs flex items-center gap-1">
                            <NumberFormatter value={info?.views} /> views
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-0.5 mx-1"></div>
                            {moment(info.created_at).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoBox;