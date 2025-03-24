import moment from "moment";
import NumberFormatter from "./FormatNumber";
import { Link } from "react-router-dom";
import { IoIosPlay, IoMdPlay } from "react-icons/io";
import { imageUrl } from "../../helper";
import HoverPlayYouTube from "./HoverPlayYoutube";

const SideVideo = ({ info }) => {
    return (
        <>
            <div className={`max-h-[800px] overflow-y-auto}`}>
                <div key={info.id} className="">
                    <div className="mb-4 lg:mb-[8px]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="md:col-span-1 h-full rounded">
                                <Link to={`/${info.slug}`}>
                                <div className=" relative group z-10">
                                    <img src={imageUrl(info.thumbnail?.default)} alt="" className="w-full h-full object-cover rounded-lg" />

                                    <div className="absolute inset-0 flex videos-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-[60%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                                        <a href="#" className="text-[#FFFFFF] text-3xl">
                                            <IoMdPlay className="text-[#FFFFFF]" />
                                        </a>
                                    </div>

                                    <div className="absolute top-0 right-0 z-30 m-2 px-4 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#FFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">Paid</div>
                                    {/* <span className="absolute z-20 bottom-0 right-0 m-2 px-2 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#333333]">17:08</span> */}
                                </div>
                                </Link>
                            </div>

                            <div className="lg:col-span-1">
                                <h1 className="font-Roboto text-[14px] text-[#333333] ">{info.title.length > 50 ? `${info.title.substring(0, 50)}...` : info.title}</h1>
                                <p className="font-Roboto text-[14px] text-[#666666]">{info.user?.name}</p>
                                <div className="flex items-center gap-3">
                                    <p className="font-Roboto text-[12px] text-[#666666]">
                                        <span>{info?.views}</span> views
                                    </p>
                                    <span className="h-2 w-2 bg-[#999999] rounded-full"></span>
                                    <p className="font-Roboto text-[12px] text-[#666666]">{moment(info.created_at).fromNow()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideVideo;
