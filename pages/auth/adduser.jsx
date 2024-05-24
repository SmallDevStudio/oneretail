"use client"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLine from "@/lib/hook/useLine";
import axios from "axios";
import Image from "next/image";

export default function AddUser() {
    const { logout, idTokens, accessTokens, profile } = useLine();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ loading, setLoading ] = useState(false);
    const [ data , setData ] = useState({});
    

    const onSumit = (data) => {
        setLoading(true);
        console.log(data);
    }
   
    return (
        <main className="flex flex-col w-[100%] h-[100%] p-3 bg-white">
             <div className="flex justify-center items-center text-center">
                <image
                    src="/dist/img/logo-one-retail.png"
                    alt="one-retail logo"
                    width={150}
                    height={150}
                />
                <span>ลงทะเบียนการใช้บริการ</span>
             </div>
             <div>
                <form onSubmit={handleSubmit(onSumit)}>
                    <input 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text" 
                        placeholder="รหัสพนักงาน" 
                        {...register("empid", { required: true, maxLength: 5 })}
                    />
                        {errors.name && errors.name.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        {errors.name && errors.name.type === "maxLength" && <span>ข้อความยาวเกินไป</span> }

                    <input 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text" 
                        placeholder="ชื่อ-นามสกุล" 
                        {...register("fullname", { required: true, pattern: /^[ก-๏\s]+$/i })}
                    />
                        {errors.name && errors.name.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        {errors.name && errors.name.type === "pattern" && <span>ข้อมูลไม่ถูกต้อง</span> }

                    <input 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="phone" 
                        placeholder="เบอร์โทรศัพท์" 
                        {...register("phone", { required: true, maxLength: 10 })}
                    />
                        {errors.name && errors.name.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                        {errors.name && errors.name.type === "maxLength" && <span>ข้อความยาวเกินไป</span> }

                    <div>
                        <label for="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่สำหรับจัดส่งของรางวัล</label>
                        <textarea 
                            id="address" 
                            rows={4}
                            placeholder="ที่อยู่" 
                            {...register("address", { required: true })}>
                        </textarea>
                        {errors.address && errors.address.type === "required" && <span>ช่องนี้จำเป็นต้องกรอกข้อมูล</span>}
                    </div>
                    <div>
                        <div>
                            <div>
                                <input 
                                    id="agree" 
                                    type="checkbox" 
                                    {...register("agree", { required: true })} 
                                />
                                <label for="agree" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">ฉันยอมรับข้อตกลงและเงื่อนไข</label>
                                {errors.agree && errors.agree.type === "required" && <span>ต้องยอมรับเงื่อนไข</span>}
                            </div>
                            <div>
                                <ul className="text-sm font-light text-gray-900 dark:text-gray-400 list-disc ml-10 mb-4 mt-2 text-justify">
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
                            </div>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-lg px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-40"
                        >
                            {loading ? "กําลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>

                </form>
             </div>
        </main>
    );
   
}

