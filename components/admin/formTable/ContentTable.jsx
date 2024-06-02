"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import RemoveBtn from "@/components/btn/removePage";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import TimeDisplay from "@/components/TimeDisplay";
import { Subtitles } from "@mui/icons-material";


export const ContentTable = () => {
    const router = useRouter();
    const [contents, setContents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchContents = async () => {
            const res = await fetch('/api/contents');
            const data = await res.json();
            setContents(data);
        }
        fetchContents();
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchGroups();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
    }
    const fetchSubcategories = async () => {
        const response = await axios.get('/api/subcategories');
        const sub = response.data;
        const subdata = {
            _id: sub._id,
            title: sub.title,
            subtitle: sub.subtitle
        }
        setSubcategories(subdata);
    }
    const fetchGroups = async () => {
        const response = await axios.get('/api/groups');
        setGroups(response.data);
    }
    console.log('subcategories:', subcategories);


  
    return (
        <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                        <div className="flex">
                            <Link href="/admin/contents/add">
                                <button type="button"
                                    className="border border-[#0056FF] text-[#0056FF] hover:bg-[#0056FF]/10 hover:text-[#0056FF] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#06C755]/50"
                                >
                                    เพิ่มเนื้อหา
                                </button>
                            </Link>
                        </div>

                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
                            <thead className="text-xs text-[#121D3A] uppercase bg-[#CCDDFF] dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        thumbnailUrl
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Descriptions
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        SubCategory
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Groups
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Publisher
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                    Points Coin
                                    </th>
                                    <th>
                                        Creator
                                    </th>
                                    <th>
                                        Date Created
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            {/* Table body */}
                            {contents && categories && subcategories && groups
                             && 
                                contents.map((content, index) => {
                            
                                
                                    return(
                                <>
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div key={index} className="flex items-center">
                                                <input id="checkbox-table-search-1" 
                                                    type="checkbox"
                                                    value={content._id}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                            </div>
                                        </td>

                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <Image key={index}
                                                src={content.thumbnailUrl} 
                                                alt="contents thumbnail"
                                                width={100}
                                                height={100}
                                            />
                                        </th>
                                        <td key={index} className="px-6 py-4">
                                            {content.title}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            {content.description}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            {content.categories}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            {content.subcategories}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            {content.groups}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            <div className="flex items-center">
                                                   {content.publisher}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            Point: {content.point} Coin: {content.coins}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            {content.author}
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                            <TimeDisplay time={content.createdAt} />
                                        </td>
                                        <td className="px-6 py-4" key={index}>
                                        <div className="flex w-20 items-center justify-between">
                                                <button onClick={() => router.push(`/admin/contents/${content._id}`)}>
                                                    <BorderColorOutlinedIcon/>
                                                </button>
                                                <RemoveBtn id={content._id} />
                                        </div>
                                        </td>

                                    </tr>
                                </tbody>
                                </>
                            )})}


                        </table>
                    </div>
                </div>
        </>
    );
}
  
  export default ContentTable;
