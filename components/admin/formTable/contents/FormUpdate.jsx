"use client"
import { useState, useEffect, useRef } from "react";
import { Box, TextField } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import Image from "next/image";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import { useRouter } from "next/router";

const FormAdd = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categories: '',
        subcategories: '',
        groups: '',
        point: 0,
        coins: 0,
        tags: '',
    });
    const [youtube, setYoutube] = useState(null);
    const [youtubeData, setYoutubeData] = useState(null);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [groups, setGroups] = useState([]);
    const router = useRouter();


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
        console.log(formData);
       
    }


    return (
        <>
            <div className="flex flex-col justify-center text-center items-center mt-10">
                <div className="flex flex-col space-y-2 border-2 p-5 rounded-xl shadow-xl">
                    <span className="text-3xl font-bold text-gray-800 mb-3">แก้ไขเนื้อหา</span>
                    <hr className="border-gray-300 "/>
                    <div className="flex flex-col justify-center items-center">
                    </div>
                    <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" id="youtubeUrl" />
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="ชื่อเนื้อหา" id="title" 
                            
                        />
                        <textarea className="border-2 border-gray-300 rounded-lg p-2" placeholder="รายละเอียดเนื้อหา" id="description" 
                            
                        />
                        <div className="flex flex-row">
                            <select className="border-2 border-gray-300 rounded-lg p-2" id="caterogy"
                                
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                {categorys.length > 0 && categorys.map((category) => (
                                    <option key={category._id} value={category._id}>{category.title}</option>
                                ))}
                        
                            </select>

                            <select className="border-2 border-gray-300 rounded-lg p-2" id="subcaterogy"
                                onChange={(e) => setFormData({...formData, subcategories: e.target.value})}
                            >
                                <option value="">เลือกหมวดหมู่ย่อย</option>
                                {subcategorys && subcategorys.map((subcategory) => (
                                    <option key={subcategory._id} value={subcategory._id}>{subcategory.title}</option>
                                ))}
                            </select>
                            <select className="border-2 border-gray-300 rounded-lg p-2" id="groups"
                                onChange={(e) => setFormData({...formData, groups: e.target.value})}
                            >
                                <option value="">เลือกกลุ่ม</option>
                                {groups && groups.map((group) => (
                                    <option key={group._id} value={group._id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-row">
                            <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Point" id="Point"
                            
                            />
                            <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Coin" id="Coin"
                               
                            />
                        </div>
                            <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Tags" id="Tags"
                                
                            />
                            <button className="border-2 border-gray-300 rounded-lg p-2 bg-blue-500">บันทึก</button>
                    </form>
                </div>
            

            </div>
        </>
    )

};

export default FormAdd;
