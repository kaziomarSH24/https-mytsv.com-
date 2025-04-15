import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumberFormatter from "../components/Common/FormatNumber";
import { usePrimary } from "../context/PrimaryContext";
import { Rating } from 'react-simple-star-rating';
import VideoBox from "../components/Common/VideoBox";
import { imageUrl } from "../helper";

const Profile = () => {
    const [userInfo, setUserInfo] = useState();
    const [reviews, setReviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [reviewInfo, setReviewInfo] = useState({});
    const [rating, setRating] = useState(0);
    const { state } = usePrimary();
    const params = useParams();

    useEffect(() => {
        const getUser = async () => {
            if (params.id) {
                try {
                    const res = await axios.get("Main/getUser", {
                        params: { id: params.id },
                    });
                    console.log(res.data, "res.data");
                    setUserInfo(res.data?.user);
                    setReviews(res.data?.reviews);
                    setVideos(res.data?.videos);
                } catch (e) {
                    toast.error(e.response?.data?.message);
                }
            } else {
                setUserInfo(state.user);
            }
        };

        getUser();
    }, [state.user, params.id]);

    const handleRating = (rate) => setRating(rate);

    const handleAddReview = async () => {
        const res = await axios.post(`/Main/addReview`, {
            ...reviewInfo,
            user: params.id,
            rating,
        });
        toast.success("Review added!");
        setReviews(prevReviews => [...prevReviews, res.data]);
        reviewInfo({});
    };


console.log(userInfo?.avatar?.default, "userInfo");
    return (
        <>
            <div className="pt-12 pb-28 pattern bg-red-950">
                <div className="sm:container flex justify-between items-center">
                    <h2 className="text-white md:text-6xl text-3xl font-medium mb-14 mt-6">{userInfo?.full_name}</h2>
                </div>
            </div>
            <div className="sm:container -mt-28 mb-14">
                <div className="shadow-lg rounded-2xl py-10 px-12 bg-white">
                    <div className="flex items-center gap-8 mb-6">
                        <picture>
                            <source media="(max-width: 767px)" srcSet={imageUrl(userInfo?.avatar?.mobile)} />
                            <source media="(max-width: 1023px)" srcSet={imageUrl(userInfo?.avatar?.tablet)} />
                            <img
                                src={imageUrl(userInfo?.avatar?.default)}
                                className="w-31 h-31 sm:w-40 sm:h-40 rounded-full border-4 border-primary object-cover"
                                alt={userInfo?.name}
                            />
                        </picture>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold">{userInfo?.name}</h1>
                            <p className="text-sm font-medium mb-2">Content Creator</p>
                            <div className="flex items-center gap-4 -ml-1.5">
                                <Rating SVGclassName="inline" readonly={true} allowFraction={true} initialValue={userInfo?.rating} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5 mt-8">
                        <div className="w-full sm:w-[250px] h-fit rounded-[32px] bg-[#F2F2F2] px-8 py-6">
                            <div className="mb-5">
                                <h4 className="font-semibold text-2xl  mb-1">Language</h4>
                                {userInfo?.additional_info?.languages?.map((language, index) => (
                                    <p key={index} className="text-md ">{language}</p>
                                ))}
                            </div>
                            <div className="mb-5">
                                <h4 className="font-semibold text-2xl  mb-1">Skills</h4>
                                {userInfo?.additional_info?.skills?.map((skill, index) => (
                                    <p key={index} className="text-md ">{skill}</p>
                                ))}
                            </div>
                            <div className="mb-5">
                                <h4 className="font-semibold text-2xl  mb-1">Educations</h4>
                                {userInfo?.additional_info?.educations?.map((education, index) => (
                                    <p key={index} className="text-md ">
                                        {education}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-5 px-8 mb-6">
                                <div className="text-center">
                                    <h2 className="text-6xl font-bold text-primary">
                                        <NumberFormatter value={userInfo?.views} />
                                    </h2>
                                    <p className="text-md ">Views</p>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-6xl font-bold text-primary">
                                        <NumberFormatter value={userInfo?.videos} />
                                    </h2>
                                    <p className="text-md ">Videos</p>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-6xl font-bold text-primary">
                                        <NumberFormatter value={userInfo?.likes} />
                                    </h2>
                                    <p className="text-md ">Likes</p>
                                </div>
                            </div>
                            <div className="bg-[#F2F2F2] py-6 px-8 rounded-[32px] mb-6">
                                <h2 className="text-2xl font-semibold mb-2">About</h2>
                                <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: userInfo?.additional_info?.bio }}></div>
                            </div>

                            <div className="bg-[#F2F2F2] py-6 px-8 rounded-[32px] mb-6">
                                <h2 className="text-2xl font-semibold mb-4">Popular</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {videos.map((video, index) => (
                                        <VideoBox info={video} key={index} />
                                    ))}
                                </div>
                            </div>

                            {/* Display Reviews */}
                            <div className="bg-[#F2F2F2] py-6 px-8 rounded-[32px]">
                                <h2 className="text-2xl  font-semibold mb-3">Reviews</h2>
                                {reviews.map((review, index) => (
                                    <div key={index} className="mb-4 rounded-xl border px-4 py-3">
                                        <div className="flex items-center gap-2.5 border-b w-fit pb-1.5 mb-1.5">
                                            <span className="text-xl">{review.name}</span>
                                            <span className="w-2 h-2 mt-1 bg-gray-400 rounded-full"></span>
                                            <Rating SVGclassName="inline" readonly initialValue={review.rating} size={17} />
                                        </div>
                                        <p className="italic font-medium">{review.comment}</p>
                                    </div>
                                ))}

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Add your review</h4>
                                    <Rating SVGclassName="inline" className="mb-3" onClick={handleRating} ratingValue={rating} />
                                    <input
                                        type="text"
                                        name="name"
                                        className="flex-1 w-full rounded-2xl py-3 px-4 border-2 border-gray-200 text-md text-gray-800 outline-none"
                                        placeholder="Name..."
                                        value={reviewInfo?.name}
                                        onChange={(e) => setReviewInfo({ ...reviewInfo, name: e.target.value })}
                                    />
                                    <textarea
                                        value={reviewInfo.comment}
                                        onChange={(e) => setReviewInfo({ ...reviewInfo, comment: e.target.value })}
                                        className="w-full p-2 border mt-2 rounded-xl outline-none"
                                        rows="3"
                                        placeholder="Write your review..."
                                    />
                                    <button
                                        onClick={handleAddReview}
                                        className="mt-2 bg-primary text-white px-4 py-2 rounded-xl"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
