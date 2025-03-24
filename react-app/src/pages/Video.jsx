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
import { Rating } from "react-simple-star-rating";
import { imageUrl } from "../helper";
import SideVideo from "../components/Common/SideVideo";

const Video = () => {
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

console.log(data,"data");
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
                        <img src={imageUrl(comment.user?.avatar?.default)} className="w-[50px] h-[50px] rounded-full" alt={comment.user?.name} />
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
        // console.log(data.interaction,"++ss++++++++++++++++++++++++");
        if (!state.user) return toast.error("Require Authorization");
        console.log(state.user.avatar, "state.user");
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
                    url: window.location.href,
                })
                .catch((error) => {
                    toast.error("Error sharing video: " + error);
                });
        } else {
            toast.error("Sharing not supported in this browser");
        }
    };
    return (
        <>
            {/* <div className="bg-gray-800 sm:pt-10 sm:pb-20 pattern">
                <div className="sm:container">
                    <h2 className="text-white sm:text-5xl text-3xl font-semibold px-2">{video?.category?.title ?? <Skeleton baseColor="#475569" borderRadius={30} width={250} height={50} />}</h2>
                </div>
            </div> */}

            {/* new code added */}

            <div className="max-w-[1167px] mx-auto px-4 pt-[24px] pb-[30px] lg:pb-[64px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[23px]">
                    <div className="col-span-2  ">
                        {loading ? (
                            <>
                                {video.thumbnail && (
                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={imageUrl(video.thumbnail?.mobile)} />
                                        <source media="(max-width: 1023px)" srcSet={imageUrl(video.thumbnail?.tablet)} />
                                        <img src={imageUrl(video.thumbnail?.default)} className="w-full h-full object-cover md:rounded-2xl" alt={video.title} />
                                    </picture>
                                )}
                                <div className="relative bg-[#E9ECEF] h-[300px] lg:h-[476px] rounded-xl">
                                    <button className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-primary text-white text-[65px] p-5 rounded-full">{loading ? <AiOutlineLoading className="animate-spin" /> : <IoMdPlay className="pl-2" />}</button>
                                </div>
                            </>
                        ) : (
                            <div className="bg-[#E9ECEF] h-[300px] lg:h-[476px] rounded-xl">
                                <ReactPlayer className="object-cover rounded-2xl" url={video.video} width="100%" height="100%" controls />
                            </div>
                        )}

                        <div className="py-8">
                            <h1 className="py-[15px] font-Poppins md:text-[20px] lg:text-[24px] font-medium text-[#333333]">{data.title}</h1>
                            <div className="flex flex-wrap justify-between gap-3 lg:gap-0">
                                <Link to={`/profile/${data.user?.id}`}>
                                    <div className="flex items-center gap-[8px]">
                                        <img src={imageUrl(data.user?.avatar?.default)} alt={data.user?.name} className="h-[40px] w-[40px] rounded-full" />
                                        <div className="flex flex-col">
                                            <Rating SVGclassName="inline" size={17} readonly={true} initialValue={data?.user?.rating} />
                                            <h1 className="md:text-[20px] lg:text-[20px] font-Poppins font-medium text-[#000000]">{data.user?.name}</h1>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex flex-wrap md:flex-row items-center gap-2 md:gap-1 lg:gap-[8px]">
                                    {/* views */}
                                    <div className="bg-[#E9ECEF] px-4 py-2 md:py-[6px] lg:py-[8px] rounded-full flex items-center gap-1 cursor-pointer">
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_63_2705" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9" />
                                                </mask>
                                                <g mask="url(#mask0_63_2705)">
                                                    <path
                                                        d="M12.001 16.0002C13.251 16.0002 14.3135 15.5627 15.1885 14.6877C16.0635 13.8127 16.501 12.7502 16.501 11.5002C16.501 10.2502 16.0635 9.18774 15.1885 8.31274C14.3135 7.43774 13.251 7.00024 12.001 7.00024C10.751 7.00024 9.68848 7.43774 8.81348 8.31274C7.93848 9.18774 7.50098 10.2502 7.50098 11.5002C7.50098 12.7502 7.93848 13.8127 8.81348 14.6877C9.68848 15.5627 10.751 16.0002 12.001 16.0002ZM12.001 14.2002C11.251 14.2002 10.6135 13.9377 10.0885 13.4127C9.56348 12.8877 9.30098 12.2502 9.30098 11.5002C9.30098 10.7502 9.56348 10.1127 10.0885 9.58774C10.6135 9.06274 11.251 8.80024 12.001 8.80024C12.751 8.80024 13.3885 9.06274 13.9135 9.58774C14.4385 10.1127 14.701 10.7502 14.701 11.5002C14.701 12.2502 14.4385 12.8877 13.9135 13.4127C13.3885 13.9377 12.751 14.2002 12.001 14.2002ZM12.001 19.0002C9.56764 19.0002 7.35098 18.3211 5.35098 16.9627C3.35098 15.6044 1.90098 13.7836 1.00098 11.5002C1.90098 9.21691 3.35098 7.39608 5.35098 6.03774C7.35098 4.67941 9.56764 4.00024 12.001 4.00024C14.4343 4.00024 16.651 4.67941 18.651 6.03774C20.651 7.39608 22.101 9.21691 23.001 11.5002C22.101 13.7836 20.651 15.6044 18.651 16.9627C16.651 18.3211 14.4343 19.0002 12.001 19.0002ZM12.001 17.0002C13.8843 17.0002 15.6135 16.5044 17.1885 15.5127C18.7635 14.5211 19.9676 13.1836 20.801 11.5002C19.9676 9.81691 18.7635 8.47941 17.1885 7.48774C15.6135 6.49608 13.8843 6.00024 12.001 6.00024C10.1176 6.00024 8.38848 6.49608 6.81348 7.48774C5.23848 8.47941 4.03431 9.81691 3.20098 11.5002C4.03431 13.1836 5.23848 14.5211 6.81348 15.5127C8.38848 16.5044 10.1176 17.0002 12.001 17.0002Z"
                                                        fill="#999999"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        <span>{data.views}</span>
                                    </div>

                                    {/* Like */}
                                    <div className="bg-[#E9ECEF] px-4 py-2 md:py-[6px] lg:py-[8px] rounded-full flex items-center gap-1 cursor-pointer" onClick={() => Interaction("like")}>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15.2381 20H4.7619V7L11.4286 0L12.619 1.25C12.7302 1.36667 12.8214 1.525 12.8929 1.725C12.9643 1.925 13 2.11667 13 2.3V2.65L11.9524 7H18.0952C18.6032 7 19.0476 7.2 19.4286 7.6C19.8095 8 20 8.46667 20 9V11C20 11.1167 19.9841 11.2417 19.9524 11.375C19.9206 11.5083 19.8889 11.6333 19.8571 11.75L17 18.8C16.8571 19.1333 16.619 19.4167 16.2857 19.65C15.9524 19.8833 15.6032 20 15.2381 20ZM6.66667 18H15.2381L18.0952 11V9H9.52381L10.8095 3.5L6.66667 7.85V18ZM4.7619 7V9H1.90476V18H4.7619V20H0V7H4.7619Z"
                                                    fill={`${data?.interaction === "like" ? "#0A2A8D" : "#666666"}`}
                                                />
                                            </svg>
                                        </span>
                                        <span>
                                            <NumberFormatter value={data.likes} />
                                        </span>
                                    </div>

                                    {/* DisLike */}
                                    <div className="bg-[#E9ECEF] px-4 py-2 md:py-[6px] lg:py-[8px] rounded-full flex items-center gap-1 cursor-pointer" onClick={() => Interaction("dislike")}>
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_63_2784" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9" />
                                                </mask>
                                                <g mask="url(#mask0_63_2784)">
                                                    <path
                                                        d="M6 3H17V16L10 23L8.75 21.75C8.63333 21.6333 8.5375 21.475 8.4625 21.275C8.3875 21.075 8.35 20.8833 8.35 20.7V20.35L9.45 16H3C2.46667 16 2 15.8 1.6 15.4C1.2 15 1 14.5333 1 14V12C1 11.8833 1.01667 11.7583 1.05 11.625C1.08333 11.4917 1.11667 11.3667 1.15 11.25L4.15 4.2C4.3 3.86667 4.55 3.58333 4.9 3.35C5.25 3.11667 5.61667 3 6 3ZM15 5H6L3 12V14H12L10.65 19.5L15 15.15V5ZM17 16V14H20V5H17V3H22V16H17Z"
                                                        fill={`${data?.interaction === "dislike" ? "#0A2A8D" : "#666666"}`}
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        <span>
                                            <NumberFormatter value={data.dislikes} />
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    <div className="bg-[#E9ECEF] px-4 py-2 md:py-[6px] lg:py-[8px] rounded-full flex items-center gap-1 cursor-pointer">
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_63_2796" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9" />
                                                </mask>
                                                <g mask="url(#mask0_63_2796)">
                                                    <path d="M2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6L2 22ZM5.15 16H20V4H4V17.125L5.15 16Z" fill="#666666" />
                                                </g>
                                            </svg>
                                        </span>
                                        <span>
                                            <NumberFormatter value={data.comments_count} />
                                        </span>
                                    </div>

                                    {/* Share */}
                                    <div className="bg-[#E9ECEF] px-4 py-2 md:py-[6px] lg:py-[8px] rounded-full flex items-center gap-1 cursor-pointer" onClick={handleShare}>
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_63_2817" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9" />
                                                </mask>
                                                <g mask="url(#mask0_63_2817)">
                                                    <path d="M8.27441 23.6784L0.274414 9.82202L20.7289 7.25022L8.27441 23.6784ZM8.50646 20.0804L16.2689 9.82522L3.50646 11.4201L5.25646 14.4512L11.2026 12.7502L6.75646 17.0493L8.50646 20.0804Z" fill="#666666" />
                                                </g>
                                            </svg>
                                        </span>
                                        <span>Share</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#F8F9FA] px-4 py-6 rounded my-5">
                                <p className="font-Roboto text-[16px] text-[#666666] leading-[25px]">
                                    {video.description} {/*<span className="text-secondery font-Roboto text-[14px] cursor-pointer text-blue-600 ">Read more...</span>*/}
                                </p>
                            </div>
                        </div>
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
                                            <img src={state.user?.avatar?.default} className="w-8 h-8 sm:w-[45px] sm:h-[45px] rounded-full" alt="Avatar" />
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

                    {/* left site video/text */}
                    <div className="col-span-2 md:col-span-1">
                        <h1 className="font-Poppins text-[20px] font-medium text-[#000000] pb-4">You might interest in related videos</h1>

                        <InfiniteScroll
                            dataLength={relatedVideos.length}
                            next={() => setPage((prev) => prev + 1)}
                            hasMore={hasMore}
                            className=""
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
                            <div className="flex flex-col gap-4">
                                {relatedVideos.map((video, idx) => (
                                    <SideVideo key={idx} info={video} className="mb-3" />
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Video;
