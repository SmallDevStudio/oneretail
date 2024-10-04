"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import axios from "axios";
import Loading from "@/components/Loading";
import LearningContent from "@/components/learning/LearningContent";
import CommentList from "@/components/content/CommentList";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";


const fetcher = (url) => axios.get(url).then((res) => res.data);
const SlugPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [content, setContent] = useState({});
    const [showInput, setShowInput] = useState(false);
    const [user, setUser] = useState(null);
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data, error: swrError, isLoading: userloading } = useSWR(userId ? `/api/users/${userId}` : null, fetcher, {
        onSuccess: (data) => {
          setUser(data.user);
        },
      });
    
    const { data: contents, error: contentError, isLoading: contentsLoading, mutate: contentMutate } = useSWR('/api/content/'+ id, fetcher, {
        onSuccess: (data) => {
          setContent(data.data);
        },
      });

    const { data: commentsData, error: commentsError, isLoading: commentsLoading, mutate: commentMutate } = useSWR(`/api/content/comments?contentId=${id}`, fetcher, {
        onSuccess: (data) => {
          setComments(data.data);
        },
      });

    const handleCommentAdded = async () => {
        mutate('/api/content/comments?contentId='+id);
        setShowInput(false);
    }

    const handleDeleteComment = async (commentId) => {
        try {
          await axios.delete(`/api/content/comments/${commentId}`);
          // Refresh comments
          mutate(`/api/content/comments?contentId=${id}`);
        } catch (error) {
          console.error('Error deleting comment:', error.message);
        }
      };

    
      if (!contents || !commentsData) return <Loading />;
      if (contentError) return <p>Error: {error}</p>;

    
      
    return (
        <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full">
            <div>
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Learning</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4 text-sm">
                <div className="absolute top-0 left-0 mt-10">
                    <Link href="/learning" className="text-white">
                        <div className="flex mb-5 w-5 h-5 text-gray-500 mt-2 ml-2 cursor-pointer">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.31 117.25">
                            <path fill="currentColor" d="M58.62,117.25c-2.74,0-5.47-1.04-7.56-3.13L3.13,66.18c-4.17-4.17-4.17-10.94,0-15.12L51.07,3.13c4.17-4.17,10.94-4.17,15.11,0,4.17,4.17,4.17,10.94,0,15.12L25.8,58.62l40.38,40.38c4.17,4.17,4.17,10.94,0,15.12-2.09,2.09-4.82,3.13-7.56,3.13Z"/>
                        </svg>
                        </div>
                    </Link>
                </div>
            </div>
            {/* Tabs Content */}
            <div className="flex flex-col items-center">
                <LearningContent 
                  content={content} 
                  user={user} 
                  setShowInput={setShowInput} 
                  showInput={showInput} 
                  onCommentAdded={handleCommentAdded} 
                  comments={commentsData.data}
                  />
            </div>
            <div className="flex flex-col items-center mb-20">
                <CommentList
                  content={contents.data}
                  comments={commentsData.data} 
                  user={user} 
                  contentMutate={contentMutate}
                  commentMutate={commentMutate}
                  />
            </div>
        </main>
    )
}


export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;