import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import HoverPlayYouTube from './Common/HoverPlayYoutube';
import { imageUrl } from '../helper';
import moment from 'moment';

const ViewDetails = () => {
    const { id } = useParams();
    const [video, setVideo] = useState([]);

console.log(id, "id");
    return (
        <div>
            <h1>View Details</h1>
            <p>View Details page for video id: {id}</p>
        </div>
    );
}

export default ViewDetails;
