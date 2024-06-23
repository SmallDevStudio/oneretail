import React from "react";
import Link from "next/link";

const Widget = ({icon, title, value, url, color}) => {
    return (
        <div className={`flex flex-row border-2 rounded-2xl p-5 items-center justify-evenly gap-4 shadow-lg w-full ${color ? "text-white" : "bg-white text-black"}`} style={{backgroundColor: color}}>
            <Link href={url ? url : "#"} className="flex justify-evenly items-center text-3xl w-full">
                <div className="flex justify-center items-center text-[1.7em] w-[1em] h-[1em]">
                    {icon}
                </div>
                <div>
                    <span className="text-3xl font-bold">{value}</span>
                    <p className="text-sm font-bold text-right">{title}</p>
                </div>
            </Link>
        </div>
    );
};

export default Widget;