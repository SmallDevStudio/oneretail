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
import { IoIosArrowBack } from "react-icons/io";

const fetcher = (url) => fetch(url).then((res) => res.json());
const FormAdd = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categories: '',
        subcategories: '',
        groups: '',
        subgroups: '',
        point: 0,
        coins: 0,
        slug: '',
        author: '',
        youtubeUrl: '',
        duration: '',
        thumbnailUrl: '',
        tags: '',
        pinned: '',
        recommend: ''
    });
    const [youtube, setYoutube] = useState(null);
    const [youtubeData, setYoutubeData] = useState(null);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const [errors, setErrors] = useState({});
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
        fetchSubgroups();
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

    const fetchSubgroups = async () => {
        const response = await axios.get('/api/content/subgroup');
        setSubgroups(response.data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
        setErrors({ ...errors, [name]: '' }); // Clear error for the field when user starts typing
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
            slug: youtubeData ? youtubeData.videoId : '',
            duration: youtubeData ? youtubeData.duration : '',
            youtubeUrl: youtube,
            thumbnailUrl: youtubeData ? youtubeData.thumbnailUrl : '',
            author: userId,
            categories: formData.categories || null,
            subcategories: formData.subcategories || null,
            groups: formData.groups || null,
            subgroups: formData.subgroups || null,
            pinned: formData.pinned || false,
            recommend: formData.recommend || false,
        };
    
        try {
            const response = await axios.post('/api/contents', form);
            if (response.data) {
                new Alert("สำเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
                router.push('/admin/contents');
            } else {
                new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สำเร็จ", "error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
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
                <div className="flex flex-row items-center mb-4 gap-4">
                    <IoIosArrowBack className="flex text-3xl text-gray-700" onClick={() => router.back()} />
                    <span className="text-3xl font-bold text-gray-800 mb-3">เพิ่มเนื้อหา</span>
                </div>
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
                        onChange={handleChange} ref={titleRef} name="title"
                    />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                    
                    <textarea className="border-2 border-gray-300 rounded-lg p-2" placeholder="รายละเอียดเนื้อหา" id="description" 
                        onChange={handleChange} ref={descriptionRef} name="description"
                    />
                    {errors.description && <div className="text-red-500">{errors.description}</div>}
                    
                    <div className="flex flex-row">
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="caterogy" name="categories"
                            onChange={handleChange}
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {categorys.data && categorys.data.map((category) => (
                                <option key={category._id} value={category._id}>{category.title}</option>
                            ))}
                        </select>
                        {errors.categories && <div className="text-red-500">{errors.categories}</div>}
                        
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="subcaterogy" name="subcategories"
                            onChange={handleChange}
                        >
                            <option value="">เลือกหมวดหมู่ย่อย</option>
                            {subcategorys.data && subcategorys.data.map((subcategory) => (
                                <option key={subcategory._id} value={subcategory._id}>{subcategory.title}</option>
                            ))}
                        </select>
                        {errors.subcategories && <div className="text-red-500">{errors.subcategories}</div>}
                        
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="groups" name="groups"
                            onChange={handleChange}
                        >
                            <option value="">เลือกกลุ่ม</option>
                            {groups.data && groups.data.map((group) => (
                                <option key={group._id} value={group._id}>{group.name}</option>
                            ))}
                        </select>
                        {errors.groups && <div className="text-red-500">{errors.groups}</div>}
                        
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="subgroups" name="subgroups"
                            onChange={handleChange}
                        >
                            <option value="">เลือกsSubgroup</option>
                            {subgroups.data && subgroups.data.map((subgroup) => (
                                <option key={subgroup._id} value={subgroup._id}>{subgroup.name}</option>
                            ))}
                        </select>
                        {errors.subgroups && <div className="text-red-500">{errors.subgroups}</div>}
                    </div>

                    <div className="flex flex-row w-full gap-4 items-center">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row p-4 border-2 rounded-2xl gap-4 items-center mb-4 justify-between">
                            <div className="flex items-center">
                                <input
                                id="pinned"
                                name="pinned"
                                type="checkbox"
                                checked={formData.pinned || false}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                />
                                <label htmlFor="pinned" className="ms-2 text-md font-bold text-gray-900">
                                ปักหมุด
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                id="recommend"
                                name="recommend"
                                type="checkbox"
                                checked={formData.recommend || false}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                />
                                <label htmlFor="recommend" className="ms-2 text-md font-bold text-gray-900">
                                แนะนำ
                                </label>
                            </div>
                            </div>
                        </div>

                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2 h-10" placeholder="Point" id="Point" name="point"
                            onChange={handleChange}
                        />
                        {errors.point && <div className="text-red-500">{errors.point}</div>}
                        
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2 h-10" placeholder="Coin" id="Coin" name="coins"
                            onChange={handleChange}
                        />
                        {errors.coins && <div className="text-red-500">{errors.coins}</div>}
                    </div>
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Tags" id="Tags" name="tags"
                        onChange={handleChange}
                    />
                    {errors.tags && <div className="text-red-500">{errors.tags}</div>}
                    
                    <button className="border-2 border-gray-300 rounded-lg p-2 bg-blue-500">บันทึก</button>
                </form>
            </div>
        </div>
    );
};

export default FormAdd;
