import Header from "../global/Header";
import { useState } from "react";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";

const Edit = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSumit = async (data) => {
        setLoading(true);
        const LearningData = {
            title: data.title,
            slug: data.slug,
            description: data.description,
            youtubeUrl: data.youtubeUrl,
            caterogy: data.caterogy,
            subCaterogy: data.subCaterogy,
            options: data.options
        }

        await axios.post("/api/learning", LearningData)
            .then((res) => {
                Alert("สําเร็จ", "แก้ข้อมูลเรียบร้อย", "success");
                setLoading(false);
            })
            .catch((err) => {
                Alert("ผิดพลาด", "แก้ข้อมูลไม่สําเร็จ", "error");
                setLoading(false);
            })
    }



    return (
        <>
        <div className="flex flex-col w-full">
            <Header title="แก้ไขข้อมูล" subtitle="แก้ไขข้อมูล Learning"/>
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
        </>
    );  
}

export default Edit;