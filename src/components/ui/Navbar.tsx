"use client"
import { downloadResume } from "@/lib/utils";
import { SignInButton, useClerk } from "@clerk/nextjs";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ChartBarIcon, LogInIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
    const user = useClerk()
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [flyer, setFlyer] = useState(false);
    const [flyerTwo, setFlyerTwo] = useState(false);
    // download resume 
    // const handleClick = async () => {
    //     const response = await fetch('/api/download');

    //     if (response.status !== 200) {
    //         console.error(response.status, response.statusText);
    //         toast.error('Opps Someting Went Wrong!')
    //     }

    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'Tuhin_Kairi_Resume.pdf';
    //     link.click();
    //     toast.success("Thank you for downloading my resume")
    // };
    return (
        <header className="fixed top-0 w-full clearNav z-50 text-sm">
            <div className="max-w-5xl mx-auto flex flex-wrap p-5 flex-col md:flex-row">
                <div className="flex flex-row items-center justify-between p-3 md:p-1">
                    <Link
                        href='/'
                        className="flex text-3xl text-white font-medium mb-4 md:mb-0"
                    >WhatsApp
                    </Link>
                    <button
                        className="text-white pb-4 cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none content-end ml-auto"
                        type="button"
                        aria-label="button"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-menu"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div
                    className={
                        "md:flex flex-grow items-center" +
                        (navbarOpen ? " flex" : " hidden")
                    }
                >
                    <div className="flex-grow">

                        <Link href='/' className="font-semibold hover:underline underline-offset-4 mx-7">
                            Home
                        </Link>
                        <Link href='/about' className="font-semibold hover:underline underline-offset-4 mx-7">
                            About
                        </Link>
                        <button onClick={async()=>await downloadResume()} className="font-semibold hover:underline underline-offset-4 mx-7">
                            Resume
                        </button>
                    </div>
                    <Link
                        href="https://www.linkedin.com/in/tuhinkairi/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="invisible md:visible"
                    >
                        <LinkedInLogoIcon className="w-5 h-5" />
                    </Link>

                    <Link
                        data-v-54e46119=""
                        href="https://github.com/tuhinkairi"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="pl-7 invisible md:visible"
                    >
                        <svg
                            data-v-54e46119=""
                            width="30"
                            height="20"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            xlinkTitle="GitHub logo"
                            className="github-link--logo"
                        >
                            <path
                                data-v-54e46119=""
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.3019 0C5.50526 0 0 5.50526 0 12.3019C0 17.7392 3.52669 22.3458 8.4127 23.977C9.0244 24.0902 9.25095 23.7126 9.25095 23.3804C9.25095 23.0858 9.2434 22.3156 9.23585 21.2885C5.81488 22.0286 5.08991 19.6422 5.08991 19.6422C4.53108 18.2225 3.72304 17.8373 3.72304 17.8373C2.60537 17.0746 3.80611 17.0897 3.80611 17.0897C5.03705 17.1803 5.69405 18.3584 5.69405 18.3584C6.78906 20.2388 8.57129 19.6951 9.27361 19.3779C9.38688 18.585 9.70406 18.0412 10.0514 17.7316C7.32524 17.4295 4.45556 16.3723 4.45556 11.66C4.45556 10.3158 4.93132 9.22074 5.72426 8.35984C5.59588 8.04266 5.17298 6.79662 5.83754 5.10501C5.83754 5.10501 6.87213 4.77274 9.22074 6.36616C10.2025 6.0943 11.2522 5.95837 12.3019 5.95082C13.344 5.95837 14.4013 6.0943 15.383 6.36616C17.7316 4.77274 18.7662 5.10501 18.7662 5.10501C19.4383 6.79662 19.0154 8.05021 18.887 8.35984C19.6724 9.22074 20.1482 10.3158 20.1482 11.66C20.1482 16.3874 17.271 17.422 14.5297 17.7316C14.9677 18.1092 15.3679 18.8644 15.3679 20.0123C15.3679 21.6586 15.3528 22.9801 15.3528 23.3879C15.3528 23.7202 15.5718 24.0978 16.1986 23.977C21.0846 22.3458 24.6038 17.7392 24.6038 12.3094C24.6038 5.50526 19.0985 0 12.3019 0Z"
                                fill="white"
                            ></path>
                        </svg>
                    </Link>
                    {!user ? (

                        <SignInButton>
                            <LogInIcon className="ml-5 cursor-pointer" />
                        </SignInButton>) :

                        <Link href={'/'} className="pl-6">
                            <MessageCircleIcon />
                        </Link>
                    }
                </div>
            </div>
        </header>
    );
}
export default Navbar;