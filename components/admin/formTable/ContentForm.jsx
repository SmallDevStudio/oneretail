import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { SlSocialYoutube } from "react-icons/sl";
import axios from "axios";
import Header from "../global/Header";
import Loading from "@/components/Loading";
import Alert from "@/lib/notification/Alert";
import Image from "next/image";

export default function ContentForm() {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const [videoUrl, setVideoUrl] = useState("");
    const [videoData, setVideoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

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
            setValue('durationMinutes', video.durationMinutes);
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
        setLoading(true);
        axios
            .post("/api/contents", data)
            .then((res) => {
                new Alert("สําเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
                setLoading(false);
                router.push("/admin/contents");
            })
            .catch((err) => {
                new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สําเร็จ", "error");
                setLoading(false);
            });
    };

    return (
        <div className="flex w-full">
            <div className="flex-col w-full">
                <div className="flex w-full">
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
                                    onChange={handleInputChange}
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
                                <div className="block mb-2 ">
                                    <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่</label>
                                    <input
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        placeholder="ใส่ หมวดหมู่"
                                        {...register("category")}
                                    />
                                </div>

                                <div className="block mb-2 ">
                                    <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่ย่อย</label>
                                    <input
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        placeholder="ใส่ หมวดหมู่ย่อย"
                                        {...register("subcategory")}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row justify-between w-2/4">
                                <div className="block mb-2">
                                    <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Point</label>
                                    <input
                                        className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        placeholder="ใส่ Point ที่จะให้"
                                        {...register("point")}
                                    />
                                </div>

                                <div className="block mb-2">
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
                            <input type="hidden" value={videoData.durationMinutes || ''} {...register("durationMinutes")} />
                            
                            <div className="flex mb-2 mt-3 w-50">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-2/6 " type="submit">บันทึก</button>
                            </div>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}