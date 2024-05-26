import { useState } from "react";
import Header from "../global/Header";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import useLine from "@/lib/hook/useLine";

const Update = (props) => {
    const [loading, setLoading] = useState(false);
    const [learning, setLearning] = useState({});
    const { employee_id } = props;
    const handleChange = (e) => {
        setLearning({...learning, [e.target.id]: e.target.value});
        console.log(e.target.value);
    }

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(learning);
        const LearningData = {
            title: learning.title,
            slug: learning.slug,
            description: learning.description,
            youtubeUrl: learning.youtubeUrl,
            caterogy: learning.caterogy,
            subCaterogy: learning.subCaterogy,
            options: learning.options,
            user_created_id: employee_id,

        }
        await axios.post("/api/learning", learning)
        .then((res) => {
            Alert("สําเร็จ", "เพิ่มข้อมูลเรียบร้อย", "success");
            setLoading(false);
        });
    }

    return (
        <div className="flex flex-col w-full">
            <Header title="เพิ่มข้อมูล" subtitle="เพิ่มข้อมูล Learning"/>
            <div>
                <form onSubmit={handleSubmit} className="flex flex-col px-3 py-3">
                    <input 
                        id="title" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มชื่อ"
                        onChange={handleChange}
                        required
                    />
                    <input 
                        id="slug" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มชื่อลิงค์" 
                        onChange={handleChange}
                        required
                    />
                    <input 
                        id="youtubeUrl" type="text" 
                        className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่ม Link Youtube" 
                        onChange={handleChange}
                    />
                    <div className="flex flex-row space-x-10 mb-2">
                        <input
                            id="category" type="select" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มประเภท" 
                        />


                        <input
                            id="subcategory" type="select" 
                            className="mb-2 text-sm rounded-full block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มประเภทย้อย" 
                        />
                        
                    </div>

                    <textarea 
                        id="description" type="text" rows={6}
                        className="mb-2 text-sm rounded-lg block w-full p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                        placeholder="เพิ่มรายละเอียด" 
                        onChange={handleChange}
                    />
                    <div className="flex flex-row space-x-10">
                        <input 
                            id="point" type="text" 
                            className="mb-2 text-sm ml-2 rounded-full block w-lg p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มคะแนน" 
                            onChange={handleChange}
                        />
                        <input 
                            id="coin" type="text" 
                            className="mb-2 text-sm ml-2 rounded-full block w-lg p-2.5 bg-[#D9D9D9] border-1 border-gray-300 focus:ring-0.5 focus:ring-[#0056FF]"
                            placeholder="เพิ่มเหรียญ" 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <input type="submit"
                            className="w-1/4 h-10 bg-[#0056FF] hover:bg-[#0056FF]/90 text-white rounded-full"
                            value={loading ? "กําลังบันทึก..." : "บันทึก"} 
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Add;