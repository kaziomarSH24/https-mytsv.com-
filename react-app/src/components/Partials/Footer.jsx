import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { usePrimary } from "../../context/PrimaryContext";

export const Footer = () => {

    const { state } = usePrimary();

    return (
        <footer className="border-t border-gray dark:border-dark rounded-t-3xl pt-12 pb-8">
            <div className="container mx-auto">
                <div className="md:grid grid-cols-12 gap-12 mb-12 flex flex-col text-center md:text-start">
                    <div className="col-span-4">
                        <img src="/assets/logo.webp" alt="Logo" width="200" height="100" className="w-44 block mb-4 mx-auto md:mx-0" />
                        <p className="text-dark-gray mb-8 capitalize">
                            {state?.settings?.business_slogan} <br />
                            <span className="text-xs flex md:w-3/4 mt-1">Expanding from the Chicagoland area to a nationwide reach, we aim to simplify and enhance the way people find services and businesses in their local communities, fostering closer connections between businesses and residents.</span>
                        </p>
                        <ul className="text-sm text-dark-gray flex flex-col gap-2">
                            <li>
                                <span>E-mail: </span>
                                <a href={`mailto:${state?.settings?.contact_email}`} className="font-normal hover:text-primary-dark dark:hover:text-yellow transition-all">
                                    {state?.settings?.contact_email}
                                </a>
                            </li>
                            <li>
                                <span>Number: </span>
                                <a href={`tel:${state?.settings?.support_phone}`} className="font-normal hover:text-primary-dark dark:hover:text-yellow transition-all">
                                    +{state?.settings?.support_phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <div className="mx-md-5">
                            <h1 className="text-xl font-semibold text-dark mb-6">Useful Links</h1>
                            <ul className="text-dark-gray flex flex-col gap-6">
                                <li className="hover:text-primary-dark transition-all">
                                    <a href="">FAQ</a>
                                </li>
                                <li className="hover:text-primary-dark transition-all">
                                    <a href="">Registration</a>
                                </li>
                                <li className="hover:text-primary-dark transition-all">
                                    <a href="">Video Upload</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <h1 className="text-xl font-semibold text-dark mb-6">Company</h1>
                        <ul className="text-dark-gray flex flex-col gap-6">
                            <li className="hover:text-primary-dark transition-all">
                                <a href="">About us</a>
                            </li>
                            <li className="hover:text-primary-dark transition-all">
                                <a href="">Contact</a>
                            </li>
                            <li className="hover:text-primary-dark transition-all">
                                <a href="">Terms & Conditions</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-2">
                        <h1 className="text-xl font-medium text-dark mb-6">Follow Us</h1>
                        <div className="flex gap-4 text-4xl justify-center md:justify-start">
                            <a href="https://www.facebook.com/meetyourtownspecialists" rel="noreferrer" target="_blank" aria-label="Facebook Page">
                                <FaFacebook />
                            </a>
                            <a href="https://www.youtube.com/@meet-your-town-specialists/" rel="noreferrer" target="_blank" aria-label="Instagram Page">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 mb-6 relative lg:flex flex-col">
                    <p className="text-center text-dark-gray">
                        <span>© {state?.settings?.website_name} - {state?.settings?.business_slogan}</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
