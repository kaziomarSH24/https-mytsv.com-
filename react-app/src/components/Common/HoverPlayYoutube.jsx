import { useRef } from "react";
import { getYouTubeVideoId } from "../../helper";

const HoverPlayYouTube = ({ videoUrl, thumbnail }) => {
    const iframeRef = useRef(null);
    const videoRef = useRef(null);
    const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
    const videoId = isYouTube ? getYouTubeVideoId(videoUrl) : null;

    const handleMouseEnter = () => {
        if (isYouTube) {
            iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        } else {
            videoRef.current?.play();
        }
    };

    const handleMouseLeave = () => {
        if (isYouTube) {
            iframeRef.current.src = "";
        } else {
            videoRef.current?.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="w-full h-[200px] mx-auto lg:h-[150px] bg-gray-900 rounded-lg overflow-hidden mb-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundImage:  `url(${thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {isYouTube ? (
                <iframe
                    ref={iframeRef}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            ) : (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    src={videoUrl}
                    style={{
                        backgroundImage:  `url(${thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            )}
        </div>
    );
};

export default HoverPlayYouTube;
