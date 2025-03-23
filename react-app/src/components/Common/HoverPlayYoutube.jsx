import { useRef } from "react";
import { getYouTubeVideoId } from "../../helper";

const HoverPlayYouTube = ({ videoUrl, thumbnail,height }) => {
    const videoRef = useRef(null);
    const videoId = getYouTubeVideoId(videoUrl);
    console.log(videoId, "videoId");

    const handleMouseEnter = () => {
        videoRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    };

    const handleMouseLeave = () => {
        videoRef.current.src = ""; // Stop video
    };

    return (
        <div
            className={` w-full h-[${height}px] bg-gray-900 rounded-lg overflow-hidden mb-4 `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        >
            <iframe
                ref={videoRef}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default HoverPlayYouTube;
