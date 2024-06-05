import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const PulseSurvey = () => {
    const [loading, setLoading] = useState(false);
    const [survey, setSurvey] = useState({ values: 1, memo: "" });
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();
        const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...survey, userId: userId }), // replace 'USER_ID' with actual user ID
            });

            if (response.ok) {
                const data = await response.json();
                router.push('/main');
                // Handle success (e.g., show a success message, clear the form, etc.)
            } else {
                console.error('Error submitting survey:', response.statusText);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error submitting survey:', error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSurvey({ ...survey, [name]: value });
    };

    const handleValueChange = (value) => {
        setSurvey({ ...survey, value });
    };


    return (
        <main className="flex items-center justify-center bg-[#0056FF]" style={{ minheight: "100vh", width: "100%" }}>
            <div className="flex items-center text-center justify-center p-4 min-h-[100vh]">
                <div className="relative bg-white p-2 rounded-xl">
                    <div className="flex flex-col p-2">
                        <div className="flex items-center text-center justify-center mt-[15px]">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">อุณหภูมิ</span>
                            <span className="text-[35px] font-black text-[#F2871F] dark:text-white">ความสุข</span>
                        </div>
                        <div className="flex items-center text-center justify-center mt-[15px]">
                            <span className="text-[15px] font-bold text-black dark:text-white">
                                วันนี้สุขภาพจิตใจของคุณเป็นอย่างไร?
                            </span>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit} className="">
                                <ul className="flex flex-col mt-5">
                                {[1, 2, 3, 4, 5].map((val, idx) => (
                                        <li
                                            key={val}
                                            className="relative w-full mb-3"
                                            onClick={() => handleValueChange(val)}
                                        >
                                            <div className="relative grid grid-cols-4 justify-center items-center text-left p-2">
                                                <Image
                                                    src={`/images/survey/${val}.svg`}
                                                    alt={`Survey Icon ${val}`}
                                                    width={50}
                                                    height={50}
                                                    className="absolute mb-3 ml-3"
                                                    style={{ width: "50px", height: "50px" }}
                                                />
                                                <div className={`inline-block w-full col-span-3 ml-8 rounded-xl h-6 hover:ring-2 ${val === 1 ? 'bg-[#00D655]' : val === 2 ? 'bg-[#B9D21E]' : val === 3 ? 'bg-[#FFC700]' : val === 4 ? 'bg-[#FF8A00]' : 'bg-[#FF0000]'} ${survey.value === val ? 'ring-2' : ''}`}>
                                                    <span className="inline-block ml-6 text-white font-bold">
                                                        {val === 1 ? 'เยี่ยมสุดๆ' : val === 2 ? 'ดี' : val === 3 ? 'ปานกลาง' : val === 4 ? 'พอใช้' : 'แย่'}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                </ul>
                               <div className="flex-col mt-2 text-center w-full">
                                    <label className="font-bold">
                                        Lorem ipsum dolor sit amet
                                    </label>
                                    <textarea 
                                        rows="4" 
                                        name="memo"
                                        className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
                                        value={survey.memo}
                                        onChange={handleChange}
                                    />
                               </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-4/7 bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full mt-5 mb-5"
                                        disabled={loading}
                                    >
                                        {loading ? "กำลังโหลด..." : "ส่งแบบสอบถาม"}
                                    </button>
                                </div>
                            </form>
                        </div>

                       

                       
                        
                        </div>
                </div>
            </div>
        </main>

    );
};

export default PulseSurvey;