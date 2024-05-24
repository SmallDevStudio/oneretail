import { useEffect, useState } from "react";
import useLine from "@/lib/hook/useLine";
import jwt from "jsonwebtoken";
import axios from "axios";
import Image from "next/image";

export default function AddUser() {
    const { logout, idTokens, accessTokens, profiles } = useLine();
    const [ loading, setLoading ] = useState(true);
    const [ formData , setFormData ] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const onSubmit = (formData) => {
        console.log(formData);
    }

    return (
        <main className="w-[100vw] h-[100vh] p-3 bg-white">
             <div className="flex flex-col justify-center items-center w-full mt-5 p-3">
                 {/* logo */}
                 <div className="text-center justify-center">
                     <Image
                         src="/dist/img/logo-one-retail.png"
                         alt="One Retail Logo"
                         width={200}
                         height={200}
                         priority
                     />
                 </div>
                 {/* End logo */}
 
                 {/* form */}
                 <div className="mt-5 flex flex-col items-center w-full">
                     <div className="flex flex-col text-center justify-center items-center">
                         <h1 className="max-w-3xl text-center font-bold text-[#F2871F] dark:text-white text-2xl leading-tight">
                             ลงทะเบียนการใช้งาน
                         </h1>
                         {/* Avatar */}
                         <Image
                             src={"/dist/img/avatar.png"}
                             alt="One Retail Logo"
                             width={150}
                             height={150}
                             style={{ 
                                 objectFit: "cover", 
                                 borderRadius: "50%",
                                 border: "5px solid #0056FF",
                                 marginTop: "10px",
                                 backgroundColor: "white",
                             }}
                             priority
                         />
                         <input type="hidden" name="picture" value="/dist/img/avatar.png" />
                         {/* End Avatar */}
 
                         <h2 className="max-w-3xl text-center font-bold text-[#1E3060] dark:text-white text-2xl leading-tight mt-5">
                             Website
                         </h2>
                     </div>
                 </div>
 
                 {/* form */}
                 <form className="w-full mt-5" onSubmit={onSubmit}>
                     <div className="grid gap-2 mb-2 mt-5 md:grid-cols-2">
                         <div className="relative mb-4">
                             <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                 <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                                 </svg>
                             </div>
                             <input 
                                 type="text" 
                                 id="empId" 
                                 className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="รหัสพนักงาน"
                                 onChange={handleInputChange}
                                 name="embid"
                                 required
                             />
                         </div>
                         {/* End Input */}
 
                         <div className="relative mb-4">
                             <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                 <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                 </svg>
                             </div>
                             <input 
                                 type="text" 
                                 id="name" 
                                 className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="ชื่อ-นามสกุล ภาษาไทย"
                                 onChange={handleInputChange}
                                 name="name"
                                 required
                             />
                         </div>
                         {/* End Input */}
 
                         <div className="relative mb-4">
                             <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                 <svg className=" w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
                                 </svg>
 
                             </div>
                             <input 
                                 type="phone" 
                                 id="phone"
                                 className=" bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="เบอร์โทรศัพท์"
                                 onChange={handleInputChange}
                                 name="phone"
                                 required
                             />
                         </div>
                         {/* End Input */}
                         </div>
                         <div className="relative mb-4 p-1">
                             <label htmlFor="address" className="block mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                 ที่อยู่สาขาสำหรับของรางวัล
                             </label>
                             <textarea 
                                 id="address" 
                                 rows="4" 
                                 className="block p-2 w-full text-lg text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                 placeholder="ที่อยู่"
                                 onChange={handleInputChange}
                                 name="address"
                                 required
                                 />
                             
                         </div>
 
                         <div className="flex">
                             <div className="flex items-center">
                                 <input 
                                     id="accept-terms" 
                                     aria-describedby="accept-terms" 
                                     type="checkbox" 
                                     value="" 
                                     className="w-4 h-4 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                     required
                                 />
                             </div>
                             <div className="ms-2 text-sm">
                                 <label htmlFor="accept-terms" className="text-gray-900 dark:text-white font-bold">ฉันยอมรับข้อตกลงและเงื่อนไข</label>
                             
                             </div>
                             
                         </div>
                             <ul className="text-sm font-light text-gray-900 dark:text-gray-400 list-disc ml-10 mb-4 mt-2">
                                 <li className="mb-4">
                                     เราขอยื่นยันว่าเราให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลส่วนบุคคลของคุณ ดังนั้นเรามุ่งมั่นที่จะปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PD PA) ในการเก็บรวบรวมใช้และประมวลผลข้อมูลส่วนบุคคลของคุณข้อมูลที่เราเก็บรวบรวมจะใช้เพื่อวัตถุประสงค์ที่เกี่ยวกับการให้บริการ และปรับปรุงประสิทธิภาพของบริการของเราเก่านั้นและจะไม่นำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์อื่นๆโดยไม่ได้รับความยินยอมจาก คุณล่วงหน้า 
                                 </li>
                                 <li className="mb-4">
                                     เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สามได้ยกเว้น เฉพาะในกรณีที่เราจำเป็นต้องทำเช่นนั้นตามกฎหมายหรือโดยคำสั่งของหน่วยงานราชการที่มีอำนาจ 
                                 </li>
                                 <li className="mb-4">
                                     ผู้ขออนุญาตใช้งานจะต้องไม่เผยแพร่ข้อมูลข่าวสารนี้ต่อบุคคลภายนอก ttb โดยเด็ดขาด
                                 </li>
                             </ul>

 
                         <div className="flex items-center justify-center mb-10 ps-2 text-center">
                             <button type="submit" 
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-lg px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-40"
                                    disabled={loading}
                                    >
                                 {loading ? "กําลังบันทึก..." : "บันทึก"}
                             </button>
                         </div>
                             
                     </form>
                 {/* End form */}
             </div>
        </main>
    );
   
}

