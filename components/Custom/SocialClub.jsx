import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";

const SocialClub = () => {
    const [empId, setEmpId] = useState("");
    const [empName, setEmpName] = useState("");
    const [options, setOptions] = useState([]);
    const router = useRouter();

    const { data: session } = useSession();

    const handleChangeValue = (event) => {
        const value  = event.target.value;
        if (options.includes(value)) {
            setOptions(options.filter((item) => item !== value));
        } else {
            setOptions([...options, value]);
        }
    };

    const handleSubmit = async () => {
        const data = {
            userId: session.user.id,
            empId,
            empName,
            options, // <-- Now correctly stores the array of selected values
        };

        try {
            const response = await axios.post("/api/socialclub", data);

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: 'สมัคร Social Media Club สําเร็จ',
                    confirmButtonText: "OK",
                });
                router.back();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred. Please try again later.",
            });
        }
    };

    return (
        <div className="flex flex-col mb-20">
            <div className="flex flex-row justify-between items-center w-full mt-10 mb-5">
                <IoIosArrowBack className="cursor-pointer text-gray-700" size={30} 
                    onClick={() => router.back()}
                />
                <h1 className="text-3xl font-bold text-[#0056FF] uppercase">Social Media Club</h1>
                <div></div>
            </div>

            <div className="flex flex-col w-full">
                <div className="w-full">
                    <Image
                        src="https://res.cloudinary.com/dxshvbc9c/image/upload/v1724769857/wil8xtrcw8c3mux5ebgh.jpg"
                        alt="Social Club"
                        width={600}
                        height={600}
                        loading="lazy"
                        className="w-full mb-2"
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            height: "auto",
                            width: "100%",
                        }}
                    />
                </div>
                <div className="flex flex-col w-full px-4">
                    <div className="flex justify-center w-full">
                        <span className="text-2xl font-bold text-[#0056FF] uppercase">Social Media Club</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold">คลับสำหรับ Influencer ทางด้านการเงินของ ttb</span>
                        <p className="text-sm mt-2">
                        “เพียงคุณเป็น Loan Specialist ที่สนใจ ตั้งใจ มาพร้อมกับความสม่ำเสมอ เราพร้อมสนับสนุนและเคียงข้างคุณ“รับผู้สนใจเพียง 100 คนแรกเท่านั้น (20 คน/ภาค)
                        สมาชิกทุกคนจะได้พบกับคอร์สเรียนที่ออกแบบพิเศษสำหรับคุณ พิเศษ สำหรับผู้ที่ Short VDO ได้รับการคัดเลือก จะถูกนำไปโพสต์บนช่องทาง Tiktok และ Facebook 
                        ของธนาคาร และยังได้รับสิทธิพิเศษอื่นๆ เช่น สิทธิพิเศษในการ live รวมถึง การโปรโมทโพสต์ ยิง ad ให้ฟรีจากส่วนกลาง
                        </p>
                        <div className="flex flex-col mt-1 text-sm">
                            <p className="font-bold text-lg text-[#0056FF]">คุณสมบัติผู้เข้าร่วมโครงการ</p>
                            <p className="mb-2">ต้องเข้าเงื่อนไขอย่างใดอย่างหนึ่ง ดังนี้</p>
                            <h5 className="font-bold text-[#F68B1F]">เงื่อนไขที่ 1</h5>
                            <div className="flex flex-col px-2">
                                <li>เป็นพนักงาน Loan Specialist</li>
                                <li>มีช่องTikTok เป็นของตัวเองและยอด Follower 1,000 ขึ้นไป</li>
                            </div>
                            <h5 className="font-bold text-[#F68B1F]">เงื่อนไขที่ 2</h5>
                            <div className="flex flex-col px-2">
                                <li>เป็นพนักงาน Loan Specialist</li>
                                <li>มีช่องTikTok เป็นของตัวเองและมีความสนใจอยากปั้นช่องโดยแท้จริง</li>
                            </div>
                            <h5 className="font-bold text-[#F68B1F]">เงื่อนไขที่ 3</h5>
                            <div className="flex flex-col px-2">
                                <li>เป็นพนักงาน Loan Specialist</li>
                                <li>มีช่องTikTok เป็นของตัวเองหรือเป็น Loan Ambassador</li>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Form */}
                <div className="flex flex-col w-full p-4 mt-4">
                    <div className="flex flex-col border rounded-xl p-2 shadow-xl text-sm">
                        <label htmlFor="empId" className="font-bold mt-2">
                            รหัสพนักงาน
                        </label>
                        <input
                            type="text"
                            name="empId"
                            className="w-full border rounded-xl bg-gray-200 px-2 py-1"
                            onChange={(e) => setEmpId(e.target.value)}
                            value={empId}
                        />

                        <label htmlFor="name" className="font-bold mt-2">
                            ชื่อ - นามสกุล
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border rounded-xl bg-gray-200 px-2 py-1"
                            onChange={(e) => setEmpName(e.target.value)}
                            value={empName}
                        />

                        <div className="flex flex-col mt-4 text-sm">
                            <span>เลือกเงื่อนไขที่ตรงกับตัวเอง (เลือกได้มากกว่า 1 ข้อ)</span>
                            <div className="flex flex-col px-2 mt-4 gap-2">
                                <div className="flex flex-row gap-2 items-start">
                                    <input 
                                        type="checkbox" 
                                        name="value1" 
                                        id="value1" 
                                        onChange={handleChangeValue}
                                        value="มีช่องTikTok เป็นของตัวเองและยอด Follower 1,000 ขึ้นไป"
                                    />
                                    <label htmlFor="value1" className="text-xs">
                                        มีช่องTikTok เป็นของตัวเองและยอด Follower 1,000 ขึ้นไป
                                    </label>
                                </div>

                                <div className="flex flex-row gap-2 items-start">
                                    <input 
                                        type="checkbox" 
                                        name="value2" 
                                        id="value2" 
                                        onChange={handleChangeValue}
                                        value="มีช่องTikTok เป็นของตัวเองและมีความสนใจอยากปั้นช่องโดยแท้จริง"
                                    />
                                    <label htmlFor="value2" className="text-xs">
                                        มีช่องTikTok เป็นของตัวเองและมีความสนใจอยากปั้นช่องโดยแท้จริง
                                    </label>
                                </div>

                                <div className="flex flex-row gap-2 items-start">
                                    <input 
                                        type="checkbox" 
                                        name="value3" 
                                        id="value3" 
                                        onChange={handleChangeValue}
                                        value="มีช่องTikTok เป็นของตัวเองหรือเป็น Loan Ambassador"
                                    />
                                    <label htmlFor="value3" className="text-xs">
                                        มีช่องTikTok เป็นของตัวเองหรือเป็น Loan Ambassador
                                    </label>
                                </div>

                                <div className="flex mt-5 justify-center items-center w-full mb-4">
                                    <button
                                        className="w-full bg-[#F68B1F] p-1 rounded-full text-white font-bold"
                                        onClick={handleSubmit}
                                    >
                                        สมัครเข้า Social Media Club 
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default SocialClub;
