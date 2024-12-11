import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { Divider } from "@mui/material";
import Loading from "@/components/Loading";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { FaRegImage } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoImagesOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import Feed from "@/components/social/Feed";
import FeedImages from "@/components/social/FeedImages";
import FeedVideo from "@/components/social/FeedVideo";
import { AppLayout } from "@/themes";

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

    const { data, error, mutate } = useSWR(`/api/posts/feed?userId=${session?.user?.id}`, fetcher, {
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
                post.post.toLowerCase().includes(query.toLowerCase())
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
        window.history.pushState(null, "", `?tab=${tab}`);
    }, []);

    if (!posts) return <Loading />;

    console.log('posts', posts);
    console.log('user', user);
    console.log('images', images);
    console.log('videos', videos);

    return (
        <div className="flex flex-col w-full min-h-screen mb-20">
            <div className="flex flex-row items-center justify-between gap-4 w-full mt-2 px-2">
                <div className="flex flex-row items-center gap-2">
                    <h1 
                        className="text-xl text-[#0056FF] font-bold ml-2"
                        style={{ fontFamily: 'Ekachon' }}
                    >
                        One Society
                    </h1>
                </div>

                <div className="flex flex-row items-center gap-2">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="ชื่อผู้ใช้ หรือโพสต์"
                            className="border border-gray-300 rounded-full px-4 py-0.5 text-sm"
                            value={query}
                            onChange={handleSearchChange}
                        />
                    )}
                    <IoSearch size={25} onClick={() => setShowSearch(!showSearch)}/>
                    <AiOutlineMessage size={25}/>
                </div>
            </div>

           {/* Tab */}
           <div className="flex justify-center text-sm">
                <ul className="flex flex-wrap justify-between gap-6 items-center">
                
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
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'frinds' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('frinds')}
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
                            href="#images"
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'images' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                            onClick={() => handleTabClick('images')}
                        >
                            <IoImagesOutline 
                                size={28}
                            />
                        </Link>
                    </li>
                   
                    <li className="me-2">
                        <div 
                            className={`inline-block p-2 border-b-2 rounded-t-lg font-bold ${activeTab === 'images' ? 'text-[#0056FF] border-[#F2871F]' : 'border-transparent hover:text-[#0056FF] hover:border-[#F2871F]'}`}
                        >
                            <IoIosMenu 
                                size={35}
                            />
                        </div>
                    </li>

                </ul>
            </div>
            <Divider className="mt-[-10px]"/>

            <div className="flex flex-col bg-gray-300">
                {activeTab === 'feed' && <Feed posts={filteredPosts} user={user} />}
                {activeTab === 'images' && <FeedImages posts={images} user={user} />}
                {activeTab === 'video' && <FeedVideo posts={videos} user={user} />}
            </div>

        </div>
    );
};

export default FeedPage;

FeedPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
FeedPage.auth = true;
