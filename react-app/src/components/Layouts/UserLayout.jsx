import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { usePrimary } from "../../context/PrimaryContext";

const UserLayout = () => {
    const navigate = useNavigate();
    const { state } = usePrimary();
    const [pageTitle, setPageTitle] = useState();

    useEffect(() => {
        if (state.user === null) navigate("/");
    }, [state.user]);

    return (
        <>
            <div className="md:pt-12 md:pb-28 pb-20 pattern bg-red-950">
                <div className="sm:container flex justify-between items-center">
                    {pageTitle && <h2 className="text-white md:text-6xl text-4xl font-medium mb-14 mt-6 px-2">{pageTitle}</h2>}
                </div>
            </div>
            <section className="sm:container -mt-28 mb-14">
                <div className="shadow-lg rounded-2xl py-10 px-12 bg-white">
                    <Outlet context={{ setPageTitle }} />
                </div>
            </section>
        </>
    );
};
export default UserLayout;
