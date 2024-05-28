import React from "react";
import useLine from "@/lib/hook/useLine";
import Image from "next/image";
import LineLogoIcon from "@/resources/icons/LineLogoIcon";

const Login = () => {
    const { liffObject, login } = useLine();

    const handleLogin = () => {
        login();
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <Image
                    src="/dist/img/logo-one-retail.png"
                    alt="One Retail Logo"
                    width={300}
                    height={300}
                    className="inline"
                    sizes="100vw"
                    style={{
                        width: "300px",
                        height: "auto",
                    }}
                    priority
                />
                   
                <div className="mt-5">
                    <button type="button" 
                            className="text-white bg-[#06C755] hover:bg-[#06C755]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center font-semibold dark:focus:ring-[#06C755]/55 me-2 mb-2"
                            onClick={handleLogin}
                            >
                        <LineLogoIcon className="w-6 h-6 me-2 mr-5 "/>
                        Sign in with Line
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;