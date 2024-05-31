import { useState, useEffect } from "react";
import LineLogoIcon from "@/resources/icons/LineLogoIcon";
import Image from "next/image";
import { signIn } from "next-auth/react";


export default function Login() {
 
    return (
        <div className="releative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center justify-center w-full">
                <Image
                    src="/dist/img/logo-one-retail.png"
                    alt="One Retail Logo"
                    width={300}
                    height={300}
                    sizes="100vw"
                    className="inline"
                    priority
                    style={{
                        width: "300px",
                        height: "auto",
                    }}
                />

                <div className="mt-5">
               
                    <button type="button" 
                            className="text-white bg-[#06C755] hover:bg-[#06C755]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center font-semibold dark:focus:ring-[#06C755]/55 me-2 mb-2"
                            onClick={() => signIn("line")}
                            >
                        <LineLogoIcon className="w-6 h-6 me-2 mr-5 "/>
                        Sign in with Line
                    </button>

                </div>
            </div>
        </div>
    );
}