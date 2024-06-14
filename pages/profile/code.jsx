import React from "react";
import ScanQRCode from "@/components/ScanQRCode";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Code() {
    const router = useRouter();
    return (
        <div className="flex flex-col p-2 w-full bg-black min-h-[100vh]">
            <Link href="/profile" className="text-white">
                <div className="flex mb-5 w-5 h-5 text-white">
                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.31 117.25">
                        <path class="cls-1" d="M58.62,117.25c-2.74,0-5.47-1.04-7.56-3.13L3.13,66.18c-4.17-4.17-4.17-10.94,0-15.12L51.07,3.13c4.17-4.17,10.94-4.17,15.11,0,4.17,4.17,4.17,10.94,0,15.12L25.8,58.62l40.38,40.38c4.17,4.17,4.17,10.94,0,15.12-2.09,2.09-4.82,3.13-7.56,3.13Z"/>
                    </svg>
                </div>
            </Link>
            <ScanQRCode />
        </div>
    );
}

Code.auth = true;