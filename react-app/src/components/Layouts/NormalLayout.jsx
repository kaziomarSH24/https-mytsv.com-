import { useEffect, useContext } from "react";
import axios from "axios";
import Header from "../Partials/Header";
import { toast } from "react-toastify";
import { Footer } from "../Partials/Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { PrimaryContext } from "../../context/PrimaryContext";

const NormalLayout = () => {
    const { state, dispatch } = useContext(PrimaryContext);

    useEffect(() => {
        const getPrimary = async () => {
            try {
                const res = await axios.get("Main/primary");

                dispatch({ type: "SET_USER", payload: res.data?.user });
                dispatch({ type: "SET_LOCATION", payload: res.data?.locations });
                dispatch({ type: "SET_SETTINGS", payload: res.data?.settings });
                dispatch({
                    type: "SET_STATES",
                    payload: Object.keys(res.data?.locations).map((key) => ({
                        value: key,
                        label: res.data?.locations[key],
                    })),
                });
                dispatch({ type: "SET_CATEGORIES", payload: res.data?.categories });

            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        };
        getPrimary();
    }, [dispatch]);

    return (
        <>
            <ScrollRestoration />
            <Header states={state.states} locator={state.location} categories={state.categories} />
            <Outlet />
            <Footer />
        </>
    );
};

export default NormalLayout;
