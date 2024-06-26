"use client"
import { useState, useEffect, useRef } from "react";
import { Box, TextField } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import Image from "next/image";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());
const FormAdd = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categories: '',
        subcategories: '',
        groups: '',
        point: 0,
        coins: 0,
        slug: '',
        author: '',
        youtubeUrl: '',
        duration: '',
        thumbnailUrl: '',
        youtubeMeta: {},
        tags: '',
    });
    const [youtube, setYoutube] = useState(null);
    const [youtubeData, setYoutubeData] = useState(null);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [groups, setGroups] = useState([]);
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const titleRef = useRef();
    const descriptionRef = useRef();

    useEffect(() => {
        if (youtubeData) {
            titleRef.current.value = youtubeData.title || '';
            descriptionRef.current.value = youtubeData.description || '';
        }
    }, [youtubeData]);

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchGroups();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('/api/categories');
        setCategorys(response.data);
    };

    const fetchSubcategories = async () => {
        const response = await axios.get('/api/subcategories');
        setSubcategorys(response.data);
    };

    const fetchGroups = async () => {
        const response = await axios.get('/api/groups');
        setGroups(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title && youtubeData) {
            formData.title = youtubeData.title;
        }
        if (!formData.description && youtubeData) {
            formData.description = youtubeData.description;
        }

        const form = {
            ...formData,
            slug: youtubeData.videoId,
            duration: youtubeData.duration,
            youtube: { ...youtubeData },
            youtubeMeta: JSON.stringify(youtubeData),
            youtubeUrl: youtube,
            thumbnailUrl: youtubeData.thumbnailUrl,
            author: userId,
        };

        console.log(form);

        try {
            const response = await axios.post('/api/contents', form);
            if (response.data) {
                new Alert("สำเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
                router.push('/admin/contents');
            } else {
                new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สำเร็จ", "error");
            }
        } catch (error) {
            console.error(error);
            new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สำเร็จ", "error");
        }
    };

    const handleYoutube = async (e) => {
        try {
            const response = await axios.post('/api/getyoutube', { youtubeUrl: youtube });
            const video = response.data;
            setYoutubeData(video);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col justify-center text-center items-center mt-10">
            <div className="flex flex-col space-y-2 border-2 p-5 rounded-xl shadow-xl">
                <span className="text-3xl font-bold text-gray-800 mb-3">เพิ่มเนื้อหา</span>
                <hr className="border-gray-300 "/>
                <div className="flex flex-col justify-center items-center">
                    {youtubeData && (
                        <>
                            <span className="text-xl font-bold text-[#FF0000] ">Thumbnail</span>
                            <Image
                                src={youtubeData.thumbnailUrl}
                                alt="Youtube"
                                width={300}
                                height={300}
                                className="mb-3"
                            />
                        </>
                    )}
                </div>
                <div className="flex flex-row">
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2 w-5/6" placeholder="YoutubeUrl" id="youtubeLink"
                        onChange={(e) => setYoutube(e.target.value)}
                    />
                    <button type="button" className="border-2 rounded-lg p-2 bg-[#FF0000] w-1/6 ml-2" onClick={handleYoutube}>
                        <YouTubeIcon sx={{ color: "white" }} />
                    </button>
                </div>
                <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="ชื่อเนื้อหา" id="title" 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} ref={titleRef}
                    />
                    <textarea className="border-2 border-gray-300 rounded-lg p-2" placeholder="รายละเอียดเนื้อหา" id="description" 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} ref={descriptionRef}
                    />
                    <div className="flex flex-row">
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="caterogy"
                            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {categorys.data && categorys.data.map((category) => (
                                <option key={category._id} value={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="subcaterogy"
                            onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                        >
                            <option value="">เลือกหมวดหมู่ย่อย</option>
                            {subcategorys.data && subcategorys.data.map((subcategory) => (
                                <option key={subcategory._id} value={subcategory._id}>{subcategory.title}</option>
                            ))}
                        </select>
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="groups"
                            onChange={(e) => setFormData({ ...formData, groups: e.target.value })}
                        >
                            <option value="">เลือกกลุ่ม</option>
                            {groups.data && groups.data.map((group) => (
                                <option key={group._id} value={group._id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-row">
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Point" id="Point"
                            onChange={(e) => setFormData({ ...formData, point: e.target.value })}
                        />
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Coin" id="Coin"
                            onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                        />
                    </div>
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Tags" id="Tags"
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <button className="border-2 border-gray-300 rounded-lg p-2 bg-blue-500">บันทึก</button>
                </form>
            </div>
        </div>
    );
};

export default FormAdd;
