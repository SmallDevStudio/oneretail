import { useState } from "react";
import Header from "../global/Header";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import useLine from "@/lib/hook/useLine";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

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
                    <input 
                        id="title" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มชื่อ"
                        {...register("title", { required: true })}
                        
                    />
                        {errors.title && errors.title.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    <input 
                        id="slug" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มชื่อลิงค์" 
                        {...register("slug", { required: true })}
                    />
                        {errors.slug && errors.slug.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    <input 
                        id="youtubeUrl" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่ม Link Youtube" 
                        {...register("youtubeUrl")}
                    />
                    <div className="flex flex-row space-x-10 mb-2">
                        <input
                            id="category" type="select" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มประเภท" 
                            {...register("caterogy")}
                        />


                        <input
                            id="subcategory" type="select" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มประเภทย้อย" 
                            {...register("subCaterogy")}
                        />
                        
                    </div>

                    <textarea 
                        id="description" type="text" rows={6}
                        className="mb-2 text-sm rounded-lg block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มรายละเอียด" 
                        {...register("description")}
                    />
                        {errors.description && errors.description.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    <div className="flex flex-row space-x-10">
                        <input 
                            id="point" type="text" 
                            className="mb-2 text-sm ml-2 rounded-full block w-lg p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มคะแนน" 
                            {...register("point")}
                        />
                        <input 
                            id="coin" type="text" 
                            className="mb-2 text-sm ml-2 rounded-full block w-lg p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มเหรียญ" 
                            {...register("coin")}
                        />
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