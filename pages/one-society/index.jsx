import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { IoSearch } from "react-icons/io5";
import { Divider } from "@mui/material";
import Loading from "@/components/Loading";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoImagesOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import Feed from "@/components/social/Feed";
import FeedImages from "@/components/social/FeedImages";
import FeedVideo from "@/components/social/FeedVideo";
import Friends from "@/components/social/Friends";
import Notifications from "@/components/social/Notifications";
import { AppLayout } from "@/themes";
import Messager from "@/components/utils/Messager";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);
const FeedPage = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]); // เก็บโพสต์ที่กรองแล้ว
    const [activeTab, setActiveTab] = useState('feed');
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');

    const router = useRouter();

    const { data, error, mutate } = useSWR(`/api/onesociety/feed?userId=${session?.user?.id}`, fetcher, {
        onSuccess: (data) => {
            setPosts(data.data);
            setImages(data.images);
            setVideos(data.video);
        }
    });

    const { data: user, mutate: mutateUser } = useSWR(`/api/users/${session?.user?.id}`, fetcher);

    useEffect(() => {
        const tab = router.query.tab || "feed";
        setActiveTab(tab);
    }, [router.query.tab]);

    useEffect(() => {
        if (query.trim() !== '') {
            const result = posts.filter(post =>
                post.user.fullname.toLowerCase().includes(query.toLowerCase()) ||
                post.post.toLowerCase().includes(query.toLowerCase()) ||
                post.user.empId.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(result);
        } else {
            setFilteredPosts(posts); // แสดงโพสต์ทั้งหมดเมื่อ query ว่างเปล่า
        }
    }, [query, posts]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value); // อัปเดต query เมื่อผู้ใช้พิมพ์ในช่องค้นหา
    };

    const handleTabClick = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    if (!posts) return <Loading />;

    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="flex flex-row items-center justify-between gap-4 w-full mt-2 px-2">
                <div className="flex flex-row items-center gap-2">
                    <h1 
                        className="text-md text-[#0056FF] font-bold ml-2"
                        style={{ fontFamily: 'Ekachon' }}
                    >
                        One Society
                    </h1>
                </div>

                <div className="flex flex-row justify-end items-center gap-2">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="ชื่อผู้ใช้ หรือโพสต์ หรือรหัสพนักงาน"
                            className="border border-gray-300 rounded-full px-2 py-0.5 text-sm w-[70%]"
                            value={query}
                            onChange={handleSearchChange}
                        />
                    )}
                    <IoSearch size={25} onClick={() => setShowSearch(!showSearch)}/>
                    <Messager userId={session?.user?.id} size={25} />
                </div>
            </div>

           {/* Tab */}
           <div className="flex justify-center text-sm">
                <ul className="flex flex-wrap justify-between items-center w-full px-2">
                
                    <li className="me-2">
                        <Link
                            href="#feed"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'feed' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('feed')}
                        >
                            <GoHome 
                                size={28}
                            />
                        </Link>
                    </li>

                    <li className="me-2">
                        <Link
                            href="#frinds"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'friends' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('friends')}
                        >
                            <HiOutlineUsers
                                size={28}
                            />
                        </Link>
                    </li>

                    <li className="me-2">
                        <Link
                            href="#video"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'video' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('video')}
                        >
                            <svg className="w-7 h-7 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 374.19 308.55">
                                <path fill="currentColor" d="M299.67,257.79H70.69c-20.29-.02-32.27-.28-42.68-5.59-9.71-4.94-17.46-12.7-22.41-22.43-5.59-10.97-5.59-22.86-5.59-46.55v-108.63c0-23.71,0-35.6,5.59-46.58,4.95-9.71,12.7-17.46,22.41-22.41C38.98,0,50.88,0,74.58,0h225.03c23.69,0,35.58,0,46.55,5.59,9.73,4.96,17.49,12.71,22.43,22.42,5.59,10.96,5.59,22.84,5.59,46.51v108.76c0,23.66,0,35.53-5.59,46.5-4.88,9.58-12.85,17.55-22.43,22.43-10.96,5.59-22.84,5.59-46.5,5.59ZM70.71,232.79h228.96c19.04,0,29.53,0,35.15-2.86,4.92-2.5,9-6.59,11.51-11.51,2.86-5.62,2.86-16.11,2.86-35.15v-108.76c0-19.05,0-29.54-2.86-35.16-2.53-4.97-6.51-8.94-11.51-11.49-5.63-2.87-16.13-2.87-35.2-2.87H74.58c-19.09,0-29.6,0-35.22,2.87-4.98,2.54-8.95,6.51-11.49,11.49-2.87,5.63-2.87,16.14-2.87,35.23v108.63c0,19.07,0,29.58,2.87,35.2,2.55,5,6.52,8.98,11.49,11.51,5.05,2.57,13.43,2.85,31.35,2.86Z"/>
                                <path fill="currentColor" d="M142.64,160.64v-63.49c0-3.4.91-6.74,2.63-9.67,1.73-2.93,4.2-5.35,7.18-6.99,2.97-1.65,6.34-2.47,9.74-2.38,3.4.09,6.71,1.09,9.6,2.89l50.79,31.75c2.74,1.71,5,4.09,6.57,6.92,1.57,2.83,2.39,6.01,2.39,9.24s-.82,6.41-2.39,9.24c-1.57,2.83-3.83,5.21-6.57,6.92l-50.79,31.75c-2.88,1.8-6.2,2.8-9.6,2.89-3.4.09-6.76-.73-9.74-2.38-2.97-1.65-5.45-4.06-7.18-6.99-1.73-2.93-2.63-6.27-2.63-9.67Z"/>
                                <path fill="currentColor" d="M361.11,308.55H13.08c-6.9,0-12.5-5.6-12.5-12.5s5.6-12.5,12.5-12.5h348.03c6.9,0,12.5,5.6,12.5,12.5s-5.6,12.5-12.5,12.5Z"/>
                            </svg>
                        </Link>
                    </li>
                   
                    <li className="me-2">
                        <Link 
                            href="#notification"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'notification' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('notification')}
                        >
                           <svg className="w-6 h-6 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.17 139.66">
                                <g>
                                <path fill="currentColor" d="M113.17,95.62l-8.06-8.21c-1.13-1.15-1.75-2.66-1.75-4.27v-24.82c0-20.04-13.38-37-31.67-42.45.17-.82.25-1.67.25-2.51,0-7.09-5.77-12.86-12.86-12.86s-12.86,5.77-12.86,12.86c0,.85.08,1.69.24,2.51-18.29,5.45-31.66,22.41-31.66,42.44v24.82c0,1.61-.62,3.12-1.75,4.27l-8.06,8.21c-4.47,4.56-5.72,11.04-3.25,16.93,2.47,5.89,7.97,9.55,14.36,9.55h23.75c1.14,9.6,9.32,17.06,19.22,17.06s18.08-7.47,19.22-17.06h23.75c6.39,0,11.89-3.66,14.36-9.55,2.47-5.89,1.23-12.38-3.25-16.93ZM55.7,13.36c0-1.87,1.52-3.39,3.39-3.39s3.39,1.52,3.39,3.39c0,.29-.04.56-.1.8-1.09-.08-2.18-.12-3.29-.12s-2.2.04-3.29.12c-.06-.24-.1-.51-.1-.8h0ZM59.08,129.68c-4.66,0-8.57-3.24-9.61-7.58h19.22c-1.04,4.34-4.95,7.58-9.61,7.58h0ZM107.67,108.88c-.37.88-1.86,3.73-5.62,3.73H16.11c-3.76,0-5.25-2.86-5.62-3.73-.37-.88-1.36-3.94,1.27-6.63l8.06-8.21c2.88-2.93,4.46-6.8,4.46-10.91v-24.82c0-19.19,15.61-34.8,34.8-34.8s34.8,15.61,34.8,34.8v24.82c0,4.11,1.58,7.98,4.46,10.91l8.06,8.21c2.63,2.68,1.64,5.75,1.27,6.63h0Z"/>
                                <path fill="currentColor" d="M59.08,139.66c-9.91,0-18.28-7.3-19.66-17.06h-23.31c-6.59,0-12.27-3.78-14.82-9.85-2.55-6.08-1.27-12.78,3.35-17.48l8.06-8.21c1.03-1.05,1.6-2.44,1.6-3.92v-24.82c0-19.51,12.97-37.04,31.59-42.79-.12-.72-.17-1.44-.17-2.16,0-7.37,6-13.36,13.36-13.36s13.36,6,13.36,13.36c0,.72-.06,1.44-.18,2.16,18.62,5.75,31.59,23.28,31.59,42.79v24.82c0,1.48.57,2.87,1.6,3.92l8.06,8.21c4.62,4.7,5.9,11.4,3.35,17.48-2.55,6.08-8.23,9.85-14.82,9.85h-23.31c-1.38,9.76-9.76,17.06-19.66,17.06ZM59.08,1c-6.82,0-12.36,5.55-12.36,12.36,0,.8.08,1.62.23,2.42l.09.45-.44.13c-18.43,5.49-31.3,22.74-31.3,41.96v24.82c0,1.74-.67,3.38-1.89,4.62l-8.06,8.21c-4.33,4.41-5.54,10.69-3.14,16.39,2.39,5.7,7.72,9.24,13.9,9.24h24.19l.05.44c1.13,9.48,9.18,16.62,18.73,16.62s17.6-7.15,18.73-16.62l.05-.44h24.19c6.18,0,11.51-3.54,13.9-9.24,2.39-5.7,1.19-11.98-3.14-16.39l-8.06-8.21c-1.22-1.24-1.89-2.88-1.89-4.62v-24.82c0-19.22-12.88-36.48-31.31-41.97l-.44-.13.09-.45c.16-.8.24-1.61.24-2.41,0-6.82-5.55-12.36-12.36-12.36ZM59.08,130.18c-4.82,0-8.97-3.28-10.1-7.97l-.15-.62h20.49l-.15.62c-1.12,4.69-5.28,7.97-10.1,7.97ZM50.13,122.6c1.22,3.91,4.81,6.58,8.96,6.58s7.74-2.68,8.96-6.58h-17.91ZM102.05,113.12H16.11c-4.06,0-5.68-3.09-6.08-4.04-.4-.95-1.47-4.27,1.37-7.17l8.06-8.21c2.78-2.84,4.32-6.59,4.32-10.56v-24.82c0-19.46,15.84-35.3,35.3-35.3s35.3,15.84,35.3,35.3v24.82c0,3.97,1.53,7.72,4.32,10.56l8.06,8.21c2.85,2.9,1.77,6.22,1.37,7.17h0c-.4.95-2.01,4.04-6.08,4.04ZM59.08,24.02c-18.91,0-34.3,15.39-34.3,34.3v24.82c0,4.24-1.63,8.23-4.6,11.26l-8.06,8.21c-2.42,2.46-1.5,5.28-1.17,6.08.34.8,1.71,3.43,5.16,3.43h85.94c3.45,0,4.82-2.62,5.16-3.43.34-.8,1.25-3.62-1.17-6.08l-8.06-8.21c-2.97-3.02-4.6-7.02-4.6-11.26v-24.82c0-18.91-15.39-34.3-34.3-34.3ZM62.76,14.69l-.42-.03c-2.21-.16-4.29-.16-6.5,0l-.42.03-.1-.41c-.07-.3-.11-.61-.11-.92,0-2.14,1.74-3.89,3.89-3.89s3.89,1.74,3.89,3.89c0,.31-.04.61-.11.92l-.1.41ZM59.08,10.48c-1.59,0-2.89,1.29-2.89,2.89,0,.09,0,.18.01.27,1.95-.12,3.79-.12,5.74,0,0-.09.01-.18.01-.27,0-1.59-1.29-2.89-2.89-2.89Z"/>
                                </g>
                            </svg>
                        </Link>
                    </li>

                    <li className="me-2">
                        <Link 
                            href="#setting"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'setting' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('setting')}
                        >
                            <IoIosMenu 
                                size={35}
                            />
                        </Link>
                    </li>

                </ul>
            </div>
            <Divider className="mt-[-10px]"/>

            <div className="flex flex-col bg-gray-300">
                {activeTab === 'feed' && 
                    <div className="flex flex-col bg-gray-300 h-screen pb-20 max-w-screen overflow-x-hidden">
                        <Feed 
                            posts={filteredPosts} 
                            user={user} 
                            mutate={mutate}
                        />
                    </div>
                }
                {activeTab === 'friends' && 
                    <Friends user={user}/>
                }
                {activeTab === 'video' && <FeedVideo posts={videos} user={user} />}
                {activeTab === 'notification' && 
                    <Notifications user={user}/>
                }
            </div>

        </div>
    );
};

export default FeedPage;

FeedPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
FeedPage.auth = true;
