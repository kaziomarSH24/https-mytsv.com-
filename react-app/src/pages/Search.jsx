import { useParams } from "react-router-dom";
import Slider from "../components/Home/Slider";
import ViewDetails from "../components/ViewDetails";

const Search = () => {
    const { id } = useParams();

    return (
        <>
           <Slider />
           <ViewDetails catId={id}/>
        </>
    );
};

export default Search;
