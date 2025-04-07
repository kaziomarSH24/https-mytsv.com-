import { shouldShowBadge } from "../../helper";

const PromotionBadge = ({ video }) => {
    return (
        <>
            {shouldShowBadge(video) && (
                <div
                    className={`absolute top-0 right-0 z-30 m-2 px-4 py-1 rounded-md text-[12px] font-Roboto text-white opacity-100 group-hover:opacity-100 transition-opacity duration-300 ${video?.package == 3 ? 'bg-green-500' : 'bg-orange-500'}`}
                >
                    {video?.package == 3 ? '🚀 Promoted' : '👑 Premium'}
                </div>
            )}
        </>
    );
}

export default PromotionBadge;
