import React from "react";
import moment from "moment";
import "moment/locale/th";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";

const PreviewModal = ({ article, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 100 }}>
            <div className="bg-white rounded-lg w-full max-w-md mx-4 p-4 h-full overflow-y-auto">
                <div className="flex justify-end items-center">
                    <button onClick={onClose} className="text-gray-600">
                        <svg className='w-4 h-4 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                            <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">{article.title}</h1>
                    <p className="text-[12px] text-gray-500">{moment(article.createdAt).format("LLL")}</p>
                    <div className="flex flex-row mt-2 items-center">
                        <span className="text-[12px] text-gray-500 mr-2">ผู้สร้าง</span>
                        <Tooltip
                            title={
                                <div className="flex flex-col items-center">
                                    <Image 
                                        src={article.user.pictureUrl || '/images/avatar-placeholder.png'} 
                                        alt={article.user.fullname} 
                                        width={50} 
                                        height={50} 
                                        className="rounded-full mb-2"
                                    />
                                    <p className="text-sm"><strong>Name:</strong> {article.user.fullname}</p>
                                    <p className="text-sm"><strong>Employee ID:</strong> {article.user.empId}</p>
                                    {article.user.position && <p className="text-sm"><strong>Position:</strong> {article.user.position}</p>}
                                    {article.user.teamGrop && <p className="text-sm"><strong>Team Group:</strong> {article.user.teamGrop}</p>}
                                    {article.user.role && <p className="text-sm"><strong>Role:</strong> {article.user.role}</p>}
                                </div>
                            }
                            arrow
                        >
                            <span className="text-sm text-gray-500 cursor-pointer">
                                {article.user.fullname}
                            </span>
                        </Tooltip>
                    </div>
                </div>
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
        </div>
    );
};

export default PreviewModal;
