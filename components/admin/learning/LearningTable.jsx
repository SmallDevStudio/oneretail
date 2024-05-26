"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import Alert from "@/lib/notification/Alert";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json())
export const LearningTable = () => {

    const router = useRouter();

    const { data, error, isLoading } = useSWR('/api/learning', fetcher);
       if (error) return <Alert error={error} />
       if (isLoading) return <Loading />

       console.log('usersData:', data.learning);
   
    return (
        <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                        <div className="relative">
                            <Link href="/admin/learning/create">
                                <button type="button"
                                    className="border border-[#0056FF] text-[#0056FF] hover:bg-[#0056FF]/10 hover:text-[#0056FF] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#06C755]/50"
                                >
                                    เพิ่มโพส
                                </button>
                            </Link>
                        </div>
                        <label for="table-search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users"/>
                        </div>
                    </div>
                    {/* Table */}
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-[#121D3A] uppercase bg-[#CCDDFF] dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <label for="checkbox-all-search" className="sr-only">checkbox</label>
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
                                    Publicsher
                                </th>
                                <th scope="col" className="px-6 py-3">
                                   Points Coin
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        {data &&
                            data.learning.map((learning, index) => {
                            return (
                            <>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div key={index} className="flex items-center">
                                        <input id="checkbox-table-search-1" 
                                            type="checkbox"
                                            value={learning._id}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <Image key={index}
                                        class="w-10 h-10 rounded-full" 
                                        src={learning.thumbnailUrl} 
                                        alt="learning thumbnail"
                                        width={100}
                                        height={100}
                                    />
                                </th>
                                <td key={index} className="px-6 py-4">
                                    {learning.title}
                                </td>
                                <td className="px-6 py-4" key={index}>
                                    {learning.description}
                                </td>
                                <td className="px-6 py-4" key={index}>
                                    {learning.category}
                                </td>
                                <td className="px-6 py-4" key={index}>
                                    {learning.subCategory}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <button key={index} className="w-30 border bg-[#0056FF] rounded-full px-2 py-1 text-white hover:bg-[#F68B1F] focus:ring-4 focus:ring-blue-300 font-medium text-xs leading-tight dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            {learning.publicsher === true ? "Active" : "Deactive"}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4" key={index}>
                                    Point: {learning.point} Coin: {learning.coin}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit Post</button>
                                </td>
                            </tr> 
                        </tbody>
                        </>
                );
            })}
       
                    </table>
                </div>
                </>
    );
}

export default LearningTable;
