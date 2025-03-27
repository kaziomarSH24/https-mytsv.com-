import { createContext, useContext, useReducer } from "react";

// Define the initial state
const initialState = {
    videos: [],
    states: [],
    location: [],
    settings: [],
    categories: [],
    user: {},
    selectedLocation: {},
};

// Define the reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case "SET_VIDEOS":
            return { ...state, videos: action.payload };
        case "SET_STATES":
            return { ...state, states: action.payload };
        case "SET_LOCATION":
            return { ...state, location: action.payload };
        case "SET_SETTINGS":
            return { ...state, settings: action.payload };
        case "SET_CATEGORIES":
            return { ...state, categories: action.payload };
        case "SET_USER":
            return { ...state, user: action.payload };
        case "SET_SELECTED_LOCATION":
            return { ...state, selectedLocation: action.payload
        };
        default:
            return state;
    }
};

// Create the context
export const PrimaryContext = createContext();

// Create the provider component
export const PrimaryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <PrimaryContext.Provider value={{ state, dispatch }}>{children}</PrimaryContext.Provider>;
};

export const usePrimary = () => {
    const data = useContext(PrimaryContext);
    return data;
};
