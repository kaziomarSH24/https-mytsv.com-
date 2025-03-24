import axios from "axios";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";
import { IoMdPlay } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import VideoBox from "../components/Common/VideoBox";
import NumberFormatter from "../components/Common/FormatNumber";
import { AiOutlineLoading, AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiLogoTelegram, BiSolidCommentDetail } from "react-icons/bi";
import { usePrimary } from "../context/PrimaryContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { FiShare2 } from "react-icons/fi";
import { Rating } from 'react-simple-star-rating'
import { imageUrl } from "../helper";

const Videosss = () => {
    const { slug } = useParams();
    const [video, setVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const { state } = usePrimary();
    const [comment, setComment] = useState();
    const [reply, setReply] = useState();
    const [comments, setComments] = useState({});
    const commentInput = useRef();
    const [likesPercent, setLikesPercent] = useState(0);
    const [data, setData] = useState(0);

    const countInteractionPercent = (likes, dislikes) => {
        const totalVotes = likes + dislikes;
        return totalVotes === 0 ? 0 : (likes / totalVotes) * 100;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`Video/${slug}`);
                setVideo(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [slug]);

    const fetchRelatedVideos = async (page) => {
        try {
            const res = await axios.get("Main/getVideos", {
                params: {
                    related: video?.id,
                    page: page,
                },
            });
            if (res.data.data.length === 0) {
                setHasMore(false);
            } else {
                setRelatedVideos((prev) => [...prev, ...res.data.data]);
            }
        } catch (error) {
            console.error("Error fetching related videos:", error);
        }
    };

    useEffect(() => {
        setComments(video?.comments);
        setData(video);
        setLikesPercent(countInteractionPercent(video.likes, video.dislikes));
    }, [video]);

    useEffect(() => {
        if (video?.id) {
            fetchRelatedVideos(page);
        }
    }, [video, page]);

    useEffect(() => {
        setLikesPercent(countInteractionPercent(data.likes, data.dislikes));
    }, [data.likes, data.dislikes]);

    const displayComments = (comments) => {
        return comments.map((comment, key) => (
            <div className="mt-5" key={key}>
                <div className="flex items-center gap-3">
                    <picture>
                        <source media="(max-width: 767px)" srcSet={imageUrl(comment.user?.avatar?.mobile)} />
                        <source media="(max-width: 1023px)" srcSet={imageUrl(comment.user?.avatar?.tablet)} />
                        <img
                            src={imageUrl(video.user?.avatar?.default)}
                            className="w-[50px] h-[50px] rounded-full"
                            alt={comment.user?.name}
                        />
                    </picture>
                    <div>
                        <h3 className="flex items-center gap-2 font-bold">
                            {comment.user.name}
                            <span className="text-[10px] text-[#BCBCBC]">{comment.created_at}</span>
                        </h3>
                        <p className="text-[12px] text-[#000000]">{comment.comment}</p>
                    </div>
                    <span className="ml-auto mr-4 text-sm cursor-pointer" onClick={() => setReply(comment)}>
                        Reply
                    </span>
                </div>
                <div className="pl-[25px] mt-[20px] mb-[20px]">{comment.replies.length > 0 && displayComments(comment.replies)}</div>
                {key !== comments.length - 1 && comment.replies?.length > 0 && <hr className="bg-[#000000] mt-2 mb-3" />}
            </div>
        ));
    };

    const addComment = (e) => {
        e.preventDefault();
        commentInput.current.value = "";
        axios
            .post("Video/addComment", {
                comment: comment,
                video_id: video.id,
                reply: reply?.id,
            })
            .then((res) => {
                if (res.data.status === "success") {
                    setComments(res.data.comments);
                } else {
                    toast.error("Could not add comment");
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
            });
    };

    const Interaction = async (status) => {
        if (!state.user) return toast.error("Require Authorization");
        if (status === data.interaction) return;

        const res = await axios.post("Video/Interaction", {
            video_id: video.id,
            interaction: status,
        });
        if (res.data.status === "success") {
            const oldInteraction = { [data.interaction + "s"]: data[data.interaction + "s"] - 1 };
            const upd = status === "like" ? { likes: data.likes + 1, ...oldInteraction } : { dislikes: data.dislikes + 1, ...oldInteraction };
            setData({ ...video, ...upd, interaction: status });
        } else {
            toast.error("Could not interact");
        }
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: video.title,
                    text: video.description,
                    url: window.location.href
                })
                .catch((error) => {
                    toast.error('Error sharing video: ' + error);
                });
        } else {
            toast.error('Sharing not supported in this browser');
        }
    };
    return (
        <>
            <div className="bg-gray-800 sm:pt-10 sm:pb-20 pattern">
                <div className="sm:container">
                    <h2 className="text-white sm:text-5xl text-3xl font-semibold px-2">{video?.category?.title ?? <Skeleton baseColor="#475569" borderRadius={30} width={250} height={50} />}</h2>
                </div>
            </div>
            <div className="sm:container">
                <div className="md:rounded-3xl md:py-8 py-4 md:px-8 bg-white -mt-10">
                    <div className="max-h-[800px] md:h-[500px] h-[220px] w-full flex justify-center items-center relative">
                        {loading ? (
                            <>
                                {video.thumbnail && (

                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                        <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                        <img src={imageUrl(video.thumbnail?.default)}
                                            className="w-full h-full object-cover md:rounded-2xl" alt={video.title} />
                                    </picture>
                                )}
                                <button className="absolute bg-primary text-white text-[65px] p-5 rounded-full">{loading ? <AiOutlineLoading className="animate-spin" /> : <IoMdPlay className="pl-2" />}</button>
                            </>
                        ) : (
                            <div className="player-wrapper w-full h-full rounded-xl">
                                <ReactPlayer className="object-cover rounded-2xl" url={video.video} width="100%" height="100%" controls />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 mt-5">
                        <div className="flex-1">
                            <h1 className="text-3xl font-semibold mx-2 md:mx-0">{data.title}</h1>
                            <div className="sm:flex grid grid-cols-4 gap-8 items-center my-4 mb-5 mx-2 md:mx-0">
                                <div className="flex gap-2 items-center">
                                    <BsEyeFill className="text-[#8B8B8B] text-3xl" />
                                    <span className="text-md text-[#8B8B8B]">
                                        <NumberFormatter value={data.views} />
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <BiSolidCommentDetail className="text-[#8B8B8B] text-3xl" />
                                    <span className="text-md text-[#8B8B8B]">
                                        <NumberFormatter value={data.comments_count} />
                                    </span>
                                </div>

                                <div className="flex gap-2 items-center cursor-pointer" onClick={() => Interaction("like")}>
                                    <AiFillLike className={`${data?.interaction === "like" ? "text-[#0A2A8D]" : "text-[#8B8B8B]"} text-3xl`} />
                                    <span className="text-md text-[#8B8B8B]">
                                        <NumberFormatter value={data.likes} />
                                    </span>
                                </div>

                                <div className="gap-2 items-center sm:w-[20%] w-0 h-[2px] bg-[#DBDBDB] rounded-full hidden sm:flex">
                                    <span className="bg-[#0A2A8D] h-[3px] rounded-full transition-all duration-500" style={{ width: `${likesPercent}%` }}></span>
                                </div>

                                <div className="flex gap-2 items-center cursor-pointer" onClick={() => Interaction("dislike")}>
                                    <AiFillDislike className={`${data?.interaction === "dislike" ? "text-[#0A2A8D]" : "text-[#8B8B8B]"} text-3xl`} />
                                    <span className="text-md text-[#8B8B8B]">
                                        <NumberFormatter value={data.dislikes} />
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center cursor-pointer" onClick={handleShare}>
                                    <FiShare2 className="text-[#8B8B8B] text-3xl" />
                                    <span className="text-md text-[#8B8B8B]">Share</span>
                                </div>
                            </div>

                            <Link to={`/Profile/${data?.user?.id}`} className="flex items-center gap-3 mb-8 mx-2 md:mx-0">
                                <picture>
                                    <source media="(max-width: 767px)" srcSet={imageUrl(data.user?.avatar?.mobile)} />
                                    <source media="(max-width: 1023px)" srcSet={imageUrl(data.user?.avatar?.tablet)} />
                                    <img
                                        src={imageUrl(data.user?.avatar?.default)}
                                        className="w-[55px] h-[55px] rounded-full object-cover border-2 border-primary"
                                        alt={data.user?.name}
                                    />
                                </picture>
                                <div className="flex flex-col">
                                    <Rating SVGclassName="inline" size={17} readonly={true} initialValue={data?.user?.rating} />
                                    <h4 className="text-xl text-[#8B8B8B]">{data?.user?.name}</h4>
                                </div>
                            </Link>

                            <div className="md:rounded-3xl bg-gray-100 drop-shadow md:p-8 p-4 mb-8">{video.description}</div>

                            <div className="md:rounded-3xl bg-gray-100 drop-shadow md:p-8 p-4">
                                {state.user && (
                                    <>
                                        {reply && (
                                            <div className="mb-4 mr-auto shadow md:rounded-xl rounded-lg p-3 bg-white">
                                                <span className="block mb-1 text-sm sm:text-base">Replying to {reply?.user?.name}</span>
                                                <span className="text-xs text-gray-600">{reply?.comment}</span>
                                            </div>
                                        )}
                                        <form onSubmit={addComment} className="flex items-center gap-3 mb-4">
                                            <img src={state.user?.avatar} className="w-8 h-8 sm:w-[45px] sm:h-[45px] rounded-full" alt="Avatar" />
                                            <input type="text" ref={commentInput} className="flex-1 text-sm sm:text-base text-gray-500 border-b border-gray-300 bg-transparent outline-none py-2" placeholder="Add Comment" onChange={(e) => setComment(e.target.value)} />
                                            <button type="submit" className="text-primary">
                                                <BiLogoTelegram className="text-2xl sm:text-4xl cursor-pointer" />
                                            </button>
                                        </form>
                                    </>
                                )}
                                <div className="bg-white rounded-xl pt-2 pb-6 px-3 md:px-5">{comments?.length > 0 ? displayComments(comments) : <h1 className="text-center mt-4 text-base sm:text-lg font-medium text-gray-600">No comments yet...</h1>}</div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 lg:grid-cols-1 grid-cols-1 w-full lg:max-w-[300px] gap-5 md:p-2 rounded">
                            <InfiniteScroll
                                dataLength={relatedVideos.length}
                                next={() => setPage((prev) => prev + 1)}
                                hasMore={hasMore}
                                className="grid md:grid-cols-3 lg:grid-cols-1 grid-cols-1 w-full lg:max-w-[300px] gap-5 md:p-2 rounded"
                                loader={
                                    <>
                                        {Array(2)
                                            .fill()
                                            .map((_, key) => (
                                                <div className="w-full h-full" key={key}>
                                                    <Skeleton height={180} borderRadius={20} />
                                                    <Skeleton height={50} className="mt-4" borderRadius={20} />
                                                </div>
                                            ))}
                                    </>
                                }
                            >
                                {relatedVideos.map((video, idx) => (
                                    <VideoBox key={idx} info={video} className="mb-3" />
                                ))}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Videosss;
