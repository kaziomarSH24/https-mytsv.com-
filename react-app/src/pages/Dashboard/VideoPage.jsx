import { useParams } from 'react-router-dom';
import VideoUploadForm from '../../components/Dashboard/VideoUploadForm';
import { MdOutlineVideoSettings } from 'react-icons/md';
import Graph from '../../components/Analytics/Graph';

const EditUserVideo = () => {
    const { id } = useParams();

    return (
        <>
            <h1 className="text-4xl font-medium flex items-center gap-3 mb-4 text-gray-700">
                <MdOutlineVideoSettings />
                Edit Video
            </h1>

            <VideoUploadForm videoId={id} mode="user" />
            <Graph videoId={id} />
        </>
    );
};

export default EditUserVideo;
