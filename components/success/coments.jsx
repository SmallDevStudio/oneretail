import React from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import useSWR from "swr";
import { Suspense } from "react";
import LoadingFeed from "../LoadingFeed";
import { RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Comments = (id) => {
    const comId = id.id
    const { data, error } = useSWR(`/api/comments/${comId}`, fetcher, { refreshInterval: 2000 });
    console.log(data);

    const RemoveComment = async (id) => {
        console.log(id);
        try {
            const response = await fetch(`/api/comments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Comment deleted successfully');
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
   
    return (
        <div className="w-full flex flex-col ml-5 mr-5 justify-center">
            {data && data.map((com, i) => (
            <>
            <div className="relative ml-5 mr-5 me-2 h-20" >
                <div className="flex flex-row w-full">
                        <Image 
                            key={i} src={com.userImage} alt="profile" 
                            width={50} 
                            height={50} 
                            className="rounded-full border-3 border-[#0056FF] dark:border-white"
                            
                        />

                    <div className="flex-col space-y-1 row-span-4 ml-4">
                        <span className="font-bold flex " key={i}>
                            {com.fullname}
                        </span>
                        <span className="font-light flex" style={{ fontSize: "14px" }} key={i}>
                            {com.comment} 
                        </span>
                        
                    </div>
                </div>
                <div className="flex justify-end w-full" >
                    <button key={i} onClick={() => RemoveComment(com._id)} >
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>
            </>
            ))}
        </div>
    )
}


export default Comments;