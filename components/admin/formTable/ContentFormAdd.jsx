import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { SlSocialYoutube } from "react-icons/sl";
import Alert from "@/lib/notification/Alert";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ContentFormAdd() {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [videoUrl, setVideoUrl] = useState("");
    const [videoData, setVideoData] = useState({});
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchGroups();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('/api/categories');
        console.log(response.data);
        setCategories(response.data);
    };

    const fetchSubcategories = async () => {
        const response = await axios.get('/api/subcategories');
        setSubcategories(response.data);
    };

    const fetchGroups = async () => {
        const response = await axios.get('/api/groups');
        setGroups(response.data);
    };


    const fetchVideoData = async () => {
        try {
            console.log(videoUrl);
            const response = await axios.post('/api/getyoutube', { youtubeUrl: videoUrl });
            const video = response.data;
            setVideoData(video);

            setValue('title', video.title);
            setValue('description', video.description);
            setValue('videoId', video.videoId);
            setValue('slug', video.videoId);
            setValue('thumbnailUrl', video.thumbnailUrl);
            setValue('duration', video.duration);
        } catch (error) {
            console.error(error);
        };
    }

    const onSubmit = async (data) => {
        console.log(data);
        setLoading(true);
        const response = await axios('/api/contents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                ...data,
                author: session.user.id,
            }
        });
        console.log('response data:', response.data);
        if (response.data) {
            setLoading(false);
            new Alert("สําเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
            router.push('/admin/contents');
        } else {
            setLoading(false);
            new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สําเร็จ", "error");
        }
    }

    return (
        <div className="flex w-full">
            <div className="flex-col w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="flex-col w-full">
                    <div className="flex flex-row">
                        <div className="block mb-2 w-2/5">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <SlSocialYoutube className="w-6 h-6"/>
                                </div>
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    placeholder="ใส่ Link Youtube"
                                    {...register("youtubeUrl", { required: true })}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            fetchVideoData();
                                        }
                                    }}
                                />
                            </div>
                            <div className="text-red-500 text-sm font-bold text-left ml-10 h-2">
                                {errors.youtubeUrl && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>
                        </div>
                        <div className="flex w-40">
                            <button 
                                type="button"
                                onClick={fetchVideoData}
                                className="bg-[#FF0000] p-3 rounded-3xl text-white h-12 ml-3"
                            >
                                ดึงข้อมูล
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="block mb-2 w-2/4">
                            <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">ชื่อเรื่อง</label>
                            <input
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                placeholder="ใส่ ชื่อเรื่อง"
                                {...register('title')}
                                value={videoData.title || ''}
                                onChange={(e) => setValue('title', e.target.value)}
                            />
                        </div>

                        <div className="block mb-2 w-2/4">
                            <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">รายละเอียด</label>
                            <textarea
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                placeholder="ใส่ รายละเอียด"
                                {...register("description")}
                                value={videoData.description || ''}
                                onChange={(e) => setValue('description', e.target.value)}
                                rows={4}
                            />
                        </div>

                        {videoData.thumbnailUrl && (
                            <>
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Thumbnail</label>
                                <div className="flex flex-col w-2/6 mb-4">
                                    <Image
                                        src={videoData.thumbnailUrl}
                                        alt="Thumbnail"
                                        className="w-full h-auto"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-row justify-between w-2/4">
                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("category")}
                                    onChange={(e) => setValue('category', e.target.value)}
                                >
                                    <option value={''}>เลือกหมวด</option>
                                    {categories && categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>    
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่ย่อย</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("subcategory")}
                                    onChange={(e) => setValue('subcategory', e.target.value)}
                                >
                                    <option value={''}>เลือกหมวดหมู่ย่อย</option>
                                    {subcategories && subcategories.map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">กลุ่ม</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("groups")}
                                    onChange={(e) => setValue('groups', e.target.value)}
                                >
                                    <option value={''}>เลือกกลุ่ม</option>
                                    {groups && groups.map((group) => (
                                        <option key={group._id} value={group._id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-row w-2/4">
                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Point</label>
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    placeholder="ใส่ Point ที่จะให้"
                                    {...register("point")}
                                />
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Coins</label>
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    placeholder="ใส่ Coins ที่จะให้"
                                    {...register("coins")}
                                />
                            </div>
                        </div>

                        <input type="hidden" {...register("videoId")} value={videoData.videoId || ''} />
                        <input type="hidden" {...register("slug")} value={videoData.slug || ''} />
                        <input type="hidden" {...register("thumbnailUrl")} value={videoData.thumbnailUrl || ''} />
                        <input type="hidden" {...register("duration")} value={videoData.duration || ''} />

                        <div className="flex mb-2 mt-3 w-50">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-2/6 " type="submit">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}