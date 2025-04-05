import { useLocation } from "react-router-dom";
import {useEffect} from "react";

const ScrollToHash = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1)); // убираем #
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [hash]);

    return null;
};

export default ScrollToHash;
