import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import NumberFormatter from "../../components/Common/FormatNumber";
import { usePrimary } from "../../context/PrimaryContext";
import { Rating } from "react-simple-star-rating";
import { imageUrl } from "../../helper";

const ProfilePage = () => {
    const { setPageTitle } = useOutletContext();

    useEffect(() => {
        setPageTitle("Profile");
    }, [setPageTitle]);

    const [userInfo, setUserInfo] = useState();
    const { state } = usePrimary();
    const params = useParams();

    useEffect(() => {
        const getUser = async () => {
            if (params.id) {
                try {
                    const res = await axios.get("Main/getUser", {
                        params: {
                            id: params.id,
                        },
                    });
                    setUserInfo(res?.data);
                } catch (e) {
                    toast.error(e.response?.data?.message);
                }
            } else {
                setUserInfo(state.user);
            }
        };

        getUser();
    }, [state.user, params.id]);

    return (
        <div className="">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-6">
                <picture>
                    <source media="(max-width: 767px)" srcSet={imageUrl(userInfo.avatar?.mobile)} />
                    <source media="(max-width: 1023px)" srcSet={imageUrl(userInfo.avatar?.tablet)} />
                    <img
                        src={imageUrl(userInfo.avatar?.default)}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-primary object-cover"
                        alt={userInfo?.name}
                    />
                </picture>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-semibold">{userInfo?.name}</h2>
                    <p className="text-sm font-medium mb-2">Content Creator</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 -ml-1.5">
                        <Rating SVGclassName="inline" readonly={true} allowFraction={true} initialValue={userInfo?.rating} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 mt-8">
                <div className="w-full lg:w-[250px] rounded-[32px] bg-[#F2F2F2] px-6 sm:px-8 py-6">
                    <div className="mb-5">
                        <h4 className="font-semibold text-xl sm:text-2xl text-[#232323] mb-1">Language</h4>
                        {userInfo?.additional_info?.languages?.map((language, index) => (
                            <p key={index} className="text-md text-[#232323]">
                                {language}
                            </p>
                        ))}
                    </div>
                    <div className="mb-5">
                        <h4 className="font-semibold text-xl sm:text-2xl text-[#232323] mb-1">Skills</h4>
                        {userInfo?.additional_info?.skills?.map((skill, index) => (
                            <p key={index} className="text-md text-[#232323]">
                                {skill}
                            </p>
                        ))}
                    </div>
                    <div className="mb-5">
                        <h4 className="font-semibold text-xl sm:text-2xl text-[#232323] mb-1">Educations</h4>
                        {userInfo?.additional_info?.educations?.map((education, index) => (
                            <p key={index} className="text-md text-[#232323]">
                                {education}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 px-4 sm:px-8 mb-6">
                        <div className="text-center">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
                                <NumberFormatter value={userInfo?.views} />
                            </h2>
                            <p className="text-md text-[#232323]">Views</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
                                <NumberFormatter value={userInfo?.videos} />
                            </h2>
                            <p className="text-md text-[#232323]">Videos</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
                                <NumberFormatter value={userInfo?.likes} />
                            </h2>
                            <p className="text-md text-[#232323]">Likes</p>
                        </div>
                    </div>
                    <div className="bg-[#F2F2F2] py-6 px-6 sm:px-8 rounded-[32px]">
                        <h2 className="text-xl sm:text-2xl text-[#232323] font-semibold mb-2">About {userInfo?.full_name}</h2>
                        <div className="text-sm text-[#232323] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: userInfo?.additional_info?.bio }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;