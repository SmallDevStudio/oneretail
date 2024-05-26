import { useState } from "react";
import Header from "../global/Header";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import useLine from "@/lib/hook/useLine";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

const Add = (props) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const handleChange = (e) => {
        setLearning({...learning, [e.target.id]: e.target.value});
        console.log(e.target.value);
    }


    const onSumit = async (data) => {
        setLoading(true);
        console.log('data:', {...data,});
        try {
            const response = await axios({
                method: 'POST',
                url: process.env.NEXT_PUBLIC_BASE_URL + '/api/learning',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    ...data
                }
            })
            console.log('response data:', response.data);
            if (response.data) {
                setLoading(false);
                new Alert("สําเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
                router.push('/admin/learning');
            }
        } catch (error) {
            setLoading(false);
            new Alert("ผิดพลาด", "เพิ่มข้อมูลไม่สําเร็จ", "error");
        }
    }

    

  
    return (
        <div className="flex flex-col w-full">
            <Header title="เพิ่มข้อมูล" subtitle="เพิ่มข้อมูล Learning"/>
            <div>
                <form onSubmit={handleSubmit(onSumit)} className="flex flex-col px-3 py-3">
                    <div>
                        <label for="title" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Title</label>
                        <input 
                            id="title" type="text" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มชื่อ"
                            {...register("title", { required: true })}
                            
                        />
                            {errors.title && errors.title.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    </div>
                    
                    <div>
                        <label for="slug" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Slug</label>
                        
                        <input 
                            id="slug" type="text" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มชื่อลิงค์" 
                            {...register("slug", { required: true })}
                        />
                            {errors.slug && errors.slug.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        </div>

                    <div>
                        <label for="youtubeUrl" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Youtube Url</label>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg className="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"/>
                            </svg>
                            </div>
                            <input 
                                id="youtubeUrl" type="text" 
                                className="mb-2 border border-gray-300 bg-[#D9D9D9] text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="เพิ่ม Link Youtube" 
                                {...register("youtubeUrl")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row space-x-10 mb-2">
                        <div>
                            <label for="category" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Category</label>
                            <input
                                id="category" type="select" 
                                className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                                placeholder="เพิ่มประเภท" 
                                {...register("caterogy")}
                            />
                        </div>

                        <div>
                            <label for="subcategory" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Sub Category</label>
                            <input
                                id="subcategory" type="select" 
                                className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                                placeholder="เพิ่มประเภทย้อย" 
                                {...register("subCaterogy")}
                            />
                        </div>
                        
                    </div>

                    <div>
                        <label for="description" className="block ml-3 text-sm font-bold text-gray-700 dark:text-white">Description</label>
                        <textarea 
                            id="description" type="text" rows={6}
                            className="mb-2 text-sm rounded-lg block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มรายละเอียด" 
                            {...register("description")}
                        />
                            {errors.description && errors.description.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    </div>

                    <div className="flex flex-row space-x-10">
                        <div>
                            <label for="point" className="block ml-5 text-sm font-bold text-gray-700 dark:text-white">Point</label>
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <SavingsOutlinedIcon 
                                        className="w-6 h-6 text-gray-500"
                                    />
                                </div>
                                <input 
                                    id="point" type="text" 
                                    className="mb-2 border border-gray-300 bg-[#D9D9D9] text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="เพิ่มคะแนน" 
                                    {...register("point")}
                                />
                            </div>
                        </div>

                        <div>
                        <label for="coin" className="block ml-5 text-sm font-bold text-gray-700 dark:text-white">Coin</label>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <MonetizationOnOutlinedIcon 
                                    className="w-6 h-6 text-gray-500"
                                />
                            </div>
                            <input 
                                id="coin" type="text" 
                                className="mb-2 border border-gray-300 bg-[#D9D9D9] text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="เพิ่มเหรียญ" 
                                {...register("coin")}
                            />
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-center">
                        <button type="submit"
                            className="w-1/4 h-10 bg-[#0056FF] hover:bg-[#0056FF]/90 text-white rounded-full"
                        >
                            {loading ? "กําลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Add;