import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AppMenu() {
    const router = useRouter();

    const isActive = (path) => router.pathname === path;


    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#003654] shadow-lg text-white" style={{ fontFamily: "ttb" }}>
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                    <button type="button" className={`inline-flex flex-col items-center justify-center px-5 ${isActive('/learning') ? "text-blue-600" : ""}`} 
                        onClick={() => router.push('/learning')}>
                        <Image
                            src="/images/christmas/learning.png"
                            alt="Learning"
                            width={30}
                            height={30}
                        />
                        <span className={`text-[10px] font-bold group-hover:text-[#ED1C24] text-nowrap ${isActive('/learning') ? "text-[#ED1C24] font-bold" : ""}`}>Learning</span>
                    </button>

                    <button type="button" className={`mt-0.5 inline-flex flex-col items-center justify-center px-5 group ${isActive('/stores') ? "text-blue-600" : ""}`} 
                        onClick={() => router.push('/stores')}>
                        <Image
                            src="/images/christmas/successstory.png"
                            alt="Learning"
                            width={34}
                            height={34}
                        />
                        <span className={`text-[10px] mt-1 font-bold group-hover:text-[#ED1C24] text-nowrap ${isActive('/stores') ? "text-[#ED1C24] font-bold" : ""}`}>Success Story</span>
                    </button>

                    <button type="button" className={`mt-0.5 inline-flex flex-col items-center justify-center px-5 ${isActive('/main') ? "text-blue-600" : ""}`} 
                        onClick={() => router.push('/main')}>
                        <Image
                            src="/images/christmas/home.png"
                            alt="Learning"
                            width={34}
                            height={34}
                        />
                        <span className={`mt-0.5 text-[10px] font-bold group-hover:text-[#ED1C24] text-nowrap ${isActive('/main') ? "text-[#ED1C24] font-bold" : ""}`}>Home</span>
                    </button>

                    <button type="button" className={`inline-flex flex-col items-center justify-center px-5 ${isActive('/club') ? "text-blue-600" : ""}`} 
                        onClick={() => router.push('/club')}>
                        <Image
                            src="/images/christmas/club.png"
                            alt="Learning"
                            width={32}
                            height={32}
                        />
                        <span className={`text-[10px] font-bold group-hover:text-[#ED1C24] text-nowrap ${isActive('/club') ? "text-[#ED1C24] font-bold" : ""}`}>One Retail Club</span>
                    </button>

                    <button type="button" className={`inline-flex flex-col items-center justify-center px-5 ${isActive('/profile') ? "text-blue-600" : ""}`} 
                        onClick={() => router.push('/profile')}>
                        <Image
                            src="/images/christmas/profile.png"
                            alt="Learning"
                            width={34}
                            height={34}
                        />
                        <span className={`mt-0.5 text-[10px] font-bold group-hover:text-[#ED1C24]  text-nowrap ${isActive('/profile') ? "text-[#ED1C24] font-bold" : ""}`}>Profile</span>
                    </button>
                </div>
            </nav>
    )
}

