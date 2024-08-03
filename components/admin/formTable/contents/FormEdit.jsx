"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import { useRouter } from "next/router";
import Image from "next/image";

const FormEdit = ({ initialData }) => {
    const [formData, setFormData] = useState({
        ...initialData,
        categories: initialData?.categories?._id || '',
        subcategories: initialData?.subcategories?._id || '',
        groups: initialData?.groups?._id || '',
        subgroups: initialData?.subgroups?._id || '',
        tags: Array.isArray(initialData?.tags) ? initialData.tags.join(' ') : (initialData?.tags || '')
    });

    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchGroups();
        fetchSubgroups();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategorys(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('/api/subcategories');
            setSubcategorys(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get('/api/groups');
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const fetchSubgroups = async () => {
        try {
            const response = await axios.get('/api/subgroup');
            setSubgroups(response.data);
        } catch (error) {
            console.error("Error fetching subgroups:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = {
                ...formData,
                tags: typeof formData.tags === 'string' ? formData.tags.split(' ').filter(tag => tag) : formData.tags
            };

            const response = await axios.put(`/api/content/edit/${formData._id}`, updatedFormData);
            if (response.data.success) {
                new Alert("สำเร็จ", "อัปเดตข้อมูลเรียบร้อย", "success");
                router.push('/admin/contents');
            } else {
                new Alert("ผิดพลาด", "อัปเดตข้อมูลไม่สำเร็จ", "error");
            }
        } catch (error) {
            console.error("Error updating content:", error);
            new Alert("ผิดพลาด", "อัปเดตข้อมูลไม่สำเร็จ", "error");
        }
    };

    return (
        <div className="flex flex-col justify-center text-center items-center mt-10">
            <div className="flex flex-col space-y-2 border-2 p-5 rounded-xl shadow-xl">
                <span className="text-3xl font-bold text-gray-800 mb-3">แก้ไขเนื้อหา</span>
                <hr className="border-gray-300 "/>
                <div className="flex justify-center items-center">
                    <Image src={initialData?.thumbnailUrl} alt="image" width={200} height={200} className=""/>
                </div>
                <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="ชื่อเนื้อหา" id="title" 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title}
                    />
                    <textarea className="border-2 border-gray-300 rounded-lg p-2" placeholder="รายละเอียดเนื้อหา" id="description" 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description}
                    />
                    <div className="flex flex-row">
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="category"
                            onChange={(e) => setFormData({...formData, categories: e.target.value})} value={formData.categories}
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {categorys.data && categorys.data.map((category) => (
                                <option key={category._id} value={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="subcategory"
                            onChange={(e) => setFormData({...formData, subcategories: e.target.value})} value={formData.subcategories}
                        >
                            <option value="">เลือกหมวดหมู่ย่อย</option>
                            {subcategorys.data && subcategorys.data.map((subcategory) => (
                                <option key={subcategory._id} value={subcategory._id}>{subcategory.title}</option>
                            ))}
                        </select>
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="groups"
                            onChange={(e) => setFormData({...formData, groups: e.target.value})} value={formData.groups}
                        >
                            <option value="">เลือกกลุ่ม</option>
                            {groups.data && groups.data.map((group) => (
                                <option key={group._id} value={group._id}>{group.name}</option>
                            ))}
                        </select>
                        <select className="border-2 border-gray-300 rounded-lg p-2" id="subgroups"
                            onChange={(e) => setFormData({...formData, subgroups: e.target.value})} value={formData.subgroups}
                        >
                            <option value="">เลือกSubgroup</option>
                            {subgroups.data && subgroups.data.map((subgroup) => (
                                <option key={subgroup._id} value={subgroup._id}>{subgroup.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-row w-full gap-4 items-center">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row p-4 border-2 rounded-2xl gap-4 items-center mb-4 justify-between">
                            <div className="flex items-center">
                                <input
                                id="pinned"
                                name="pinned"
                                type="checkbox"
                                checked={formData.pinned}
                                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                />
                                <label htmlFor="pinned" className="ms-2 text-md font-bold text-gray-900">
                                ปักหมุด
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                id="new"
                                name="new"
                                type="checkbox"
                                checked={formData.new}
                                onChange={(e) => setFormData({ ...formData, new: e.target.checked })}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                />
                                <label htmlFor="new" className="ms-2 text-md font-bold text-gray-900">
                                ใหม่
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                id="recommend"
                                name="recommend"
                                type="checkbox"
                                checked={formData.recommend}
                                onChange={(e) => setFormData({ ...formData, recommend: e.target.checked })}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-xl focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                                />
                                <label htmlFor="recommend" className="ms-2 text-md font-bold text-gray-900">
                                แนะนำ
                                </label>
                            </div>
                            </div>
                        </div>

                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Point" id="point"
                            onChange={(e) => setFormData({...formData, point: e.target.value})} value={formData.point}
                        />
                        <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Coin" id="coin"
                            onChange={(e) => setFormData({...formData, coins: e.target.value})} value={formData.coins}
                        />
                    </div>
                    <input type="text" className="border-2 border-gray-300 rounded-lg p-2" placeholder="Tags" id="tags"
                        onChange={(e) => setFormData({...formData, tags: e.target.value})} value={formData.tags}
                    />
                    <button className="border-2 border-gray-300 rounded-lg p-2 bg-blue-500 text-white">บันทึก</button>
                </form>
            </div>
        </div>
    );
};

export default FormEdit;
