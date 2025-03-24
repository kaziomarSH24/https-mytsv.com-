import moment from "moment";
import NumberFormatter from "./FormatNumber";
import { Link } from "react-router-dom";
import { IoIosPlay } from "react-icons/io";
import { imageUrl } from "../../helper";

const VideoBoxss = ({ info }) => {
    return (
        <>

            <div className="flex max-h-[800px] overflow-y-auto">
                <div className="mb-4 lg:mb-[8px]">
                    <div className="gap-2">
                        <div className=" rounded  flex flex-row gap-4">
                            <div className=" relative z-10">
                                <img src={imageUrl(info.thumbnail?.default)} alt="" className="w-52 h-full object-cover" />
                                <span className="absolute z-20 bottom-0 right-0 m-2 px-2 py-1 rounded-md bg-[#999999] text-[12px] font-Roboto text-[#333333]">17:08</span>
                            </div>

                            <div className=" flex flex-col ">
                                <h1 className="font-Roboto text-[14px] text-[#333333] ">Get the Best Discounts at Michail vs Robert's ...</h1>
                                <p className="font-Roboto text-[14px] text-[#666666]">Karla Blair</p>
                                <div className="flex  items-center gap-1">
                                    <p className="font-Roboto text-[12px] text-[#666666]">
                                        <span>10.5k</span> views
                                    </p>
                                    <span className="h-2 w-2 bg-[#999999] rounded-full"></span>
                                    <p className="font-Roboto text-[12px] text-[#666666]">
                                        <span>2</span> weeks ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoBoxss;
