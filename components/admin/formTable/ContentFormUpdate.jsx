import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Alert from "@/lib/notification/Alert";
import { useSession } from "next-auth/react";

export default function ContentFormUpdate() {
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchContentData(id);
        }
        fetchCategories();
        fetchSubcategories();
        fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchContentData = async (contentId) => {
        try {
            const response = await axios.get(`/api/contents/${contentId}`);
            const content = response.data.data;
            setFormValues(content);
        } catch (error) {
            console.error(error);
        }
    };

    const setFormValues = (content) => {
        setValue('title', content.title);
        setValue('description', content.description);
        setValue('youtubeUrl', content.youtubeUrl);
        setValue('categories', content.categories);
        setValue('subcategories', content.subcategories);
        setValue('group', content.group);
        setValue('point', content.point);
        setValue('coin', content.coin);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('/api/subcategories');
            setSubcategories(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get('/api/groups');
            setGroups(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = (data) => {
        axios
            .put(`/api/contents/${id}`, {
                ...data,
                author: session.user.id,
                updatedAt: new Date(),
            })
            .then((res) => {
                new Alert("สำเร็จ", "แก้ไขข้อมูลเรียบร้อย", "success");
                router.push("/admin/contents");
            })
            .catch((err) => {
                new Alert("ผิดพลาด", "แก้ไขข้อมูลไม่สำเร็จ", "error", "ลองใหม่อีกครั้ง");
            });
    };

    return (
        <div className="flex w-full">
            <div className="flex-col w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="flex-col w-full">
                    <div className="flex flex-row">
                        <div className="block mb-2 w-2/5">
                            <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">YouTube URL</label>
                            <div className="relative">
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    placeholder="YouTube URL"
                                    {...register("youtubeUrl")}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="block mb-2 w-2/4">
                            <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">ชื่อเรื่อง</label>
                            <input
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                placeholder="ใส่ ชื่อเรื่อง"
                                {...register('title', { required: true })}
                            />
                            {errors.title && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        </div>

                        <div className="block mb-2 w-2/4">
                            <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">รายละเอียด</label>
                            <textarea
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="ใส่ รายละเอียด"
                                {...register("description", { required: true })}
                                rows={4}
                            />
                            {errors.description && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        </div>

                        <div className="flex flex-row justify-between w-2/4">
                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("categories", { required: true })}
                                >
                                    <option value={''}>เลือกหมวด</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.categories && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">หมวดหมู่ย่อย</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("subcategories", { required: true })}
                                >
                                    <option value={''}>เลือกหมวดหมู่ย่อย</option>
                                    {subcategories.map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.subcategories && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">กลุ่ม</label>
                                <select
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("group", { required: true })}
                                >
                                    <option value={''}>เลือกกลุ่ม</option>
                                    {groups.map((group) => (
                                        <option key={group._id} value={group._id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.group && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>
                        </div>

                        <div className="flex flex-row w-2/4">
                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Point</label>
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="number"
                                    placeholder="ใส่ Point ที่จะให้"
                                    {...register("point", { required: true })}
                                />
                                {errors.point && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>

                            <div className="block mb-2 ml-2">
                                <label className="block ml-5 text-lg font-medium text-gray-900 dark:text-white">Coins</label>
                                <input
                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="number"
                                    placeholder="ใส่ Coins ที่จะให้"
                                    {...register("coin", { required: true })}
                                />
                                {errors.coin && <span className="text-red-500 text-sm">ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                            </div>
                        </div>

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