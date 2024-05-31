import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { SlSocialYoutube } from "react-icons/sl";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ContentFormAdd() {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const [videoUrl, setVideoUrl] = useState("");
    const [videoData, setVideoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const router = useRouter();
    console.log({ session });
    

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error(error));
           
        fetch('/api/subcategories')
            .then((res) => res.json())
            .then((data) => setSubcategories(data))
            .catch((error) => console.error(error));
        
        fetch('/api/groups')
            .then((res) => res.json())
            .then((data) => setGroups(data))
            .catch((error) => console.error(error));
    }, []);

    const fetchVideoData = async () => {
        try {
            console.log(videoUrl);
            setLoading(true);
            const response = await axios.post('/api/getyoutube', { youtubeUrl: videoUrl });
            const video = response.data;
            setVideoData(video);

            setValue('title', video.title);
            setValue('description', video.description);
            setValue('videoId', video.videoId);
            setValue('slug', video.videoId);
            setValue('thumbnailUrl', video.thumbnailUrl);
            setValue('duration', video.duration);
            setLoading(false);
        } catch (error) {
            console.error(error);
        };
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVideoData({
          ...videoData,
          [name]: value,
        });
      };

    const onSubmit = (data) => {
        setLoadingForm(true);
        axios
            .post("/api/contents", data)
            .then((res) => {
                console.log(res.data);
                new Alert("สําเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
                setLoadingForm(false);
                router.push("/admin/contents");
            })
            .catch((err) => {
                new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สําเร็จ", "error");
                setLoadingForm(false);
            });

    };

    return (
        <div className="flex w-full">
            <div className="flex-col w-full">
                <div className="flex w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-col w-full">
                        <input type="hidden" {...register("author", { value: session?.user?.id }, setValue("author", session?.user?.id))} />
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
                                {errors.youtubeUrl && errors.youtubeUrl.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
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
                                    value={videoData.title || ''}
                                    onChange={(e) => handleInputChange(e)}
                                    name="title"
                                    {...register('title')}
                                />
                            </div>

                            <div className="block mb-2 w-2/4">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">รายละเอียด</label>
                                <textarea
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    placeholder="ใส่ รายละเอียด"
                                    value={videoData.description || ''}
                                    onChange={handleInputChange}
                                    name="description"
                                    {...register("description")}
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
                                        type="text"
                                        placeholder="ใส่ หมวดหมู่"
                                        {...register("categories")}
                                    >
                                        <option value={''}>เลือกหมวด</option>
                                        {categories && categories.length> 0 ? (
                                        categories.map((categories) => (
                                            <option key={categories.id} value={categories.id}>
                                                {categories.title}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={''}>ไม่พบหมวดหมู่</option>
                                    )}
                                    </select>    
                                </div>

                                <div className="block mb-2 ml-2">
                                    <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่ย่อย</label>
                                    <select
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        placeholder="ใส่ หมวดหมู่ย่อย"
                                        {...register("subcategories")}
                                    >
                                        <option value={''}>เลือกหมวดหมู่ย่อย</option>
                                        {subcategories && subcategories.length > 0 ? (
                                            subcategories.map((subcategories) => (
                                            <option key={subcategories.id} value={subcategories.id}>
                                                {subcategories.title}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={''}>ไม่พบหมวดหมู่ย่อย</option>
                                    )}
                                    </select>
                                </div>

                                <div className="block mb-2 ml-2">
                                    <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่ย่อย</label>
                                    <select
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        placeholder="ใส่ Gropup"
                                        {...register("groups")}
                                    >
                                        <option value={''}>เลือก Gropup</option>
                                        {groups && groups.length > 0 ? (
                                            groups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={''}>ไม่พบ Gropup</option>
                                    )}
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
                            <input type="hidden" value={videoData.videoId || ''} {...register("videoId")} />
                            <input type="hidden" value={videoData.slug || ''} {...register("slug")} />
                            <input type="hidden" value={videoData.thumbnailUrl || ''} {...register("thumbnailUrl")} />
                            <input type="hidden" value={videoData.duration || ''} {...register("duration")} />
                            
                            
                            <div className="flex mb-2 mt-3 w-50">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-2/6 " type="submit">
                                    {loadingForm ? "กําลังบันทึก..." : "บันทึก"}
                                </button>
                            </div>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}