import React from "react";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import Comments from "@/components/success/coments";
import { useRouter } from "next/router";
import { GrLike } from "react-icons/gr";
import { LuMessageCircle } from "react-icons/lu";
import { AppLayout } from "@/themes";
import CommentBar from "@/components/CommentBar";

const SlugPage = () => {
    const [content, setContent] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { slug } = router.query;
    const id = content?._id;
    const youtube = 'https://www.youtube.com/watch?v='+slug

    console.log(youtube);

    const fetchVideo = async () => {
        setLoading(true);
        const res = await fetch(`/api/content/slug/${slug}`);
        const data = await res.json();
        setContent(data);
        setLoading(false);
    };
    const fetchComments = async () => {
        setLoading(true);
        const res = await fetch(`/api/comments/${id}`);
        const data = await res.json();
        setComments(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    console.log(content);


    return (
        <main className="flex flex-col bg-gray-200" style={{
            height: "100%",
            width: "100%",
        }}>
        
            <div className="relative p-3top-[-40px] bg-white">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Success</span>
                    <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">
                        Story
                    </span>
                </div>
            </div>
            <div className="flex text-sm font-medium text-center items-center justify-center text-gray-500 border-b border-gray-200 bg-white" >
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Secret Sauce
                    </a>
                </li>
                <li className="me-2">
                    <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-[#0056FF] hover:border-[#F2871F] font-bold">
                        Share your story
                    </a>
                </li>
            </ul>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2 bg-white">
                <div className="flex flex-col w-[100vw]">
                    <div className="relative justify-center items-center">
                       <ReactPlayer url={youtube} loop={false} width={430} height={250} playing={true}/>
                    </div>
                    <div className="relative w-full p-4">
                        <h1 className="text-[18px] font-bold text-[#0056FF]" style={{ fontFamily: "Ekachon", fontSmoothing: "auto", fontWeight: "black" }}>{content?.title}</h1>
                        <p className="text-[14px] font-light" >{content?.description}</p>
                        <div >
                            <div className="relative w-full p-2 flex-row me-3">
                                <button type="button" className="text-white bg-[#F2871F] hover:bg-gray-100 border border-gray-200 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1">
                                    <GrLike className="w-5 h-3 me-2 -ms-1"/>
                                    {content?.like}
                                </button>
                                <div className="text-gray-900 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1 ms-3">
                                    <span>การดู {content?.view} ครั้ง</span>
                                </div>
                                <div className="text-gray-900 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-1 mb-1 ms-3">
                                    <LuMessageCircle className="w-5 h-3 me-2 -ms-1"/>
                                    <span>แสดงความคิดเห็น</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full justify-center items-center" style={{ height: "100%", width: "100%" }}>
                        <Comments id={id}/>
                    </div>
                        
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <CommentBar/>
            </div>
        </main>
    )
}

export default SlugPage;

SlugPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SlugPage.auth = true;