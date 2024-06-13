import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const PulseSurvey = () => {
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(false);
    const [survey, setSurvey] = useState({ value: null, memo: "" });
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAppLoading(true);
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
                setAppLoading(false);
                router.push('/main');
                // Handle success (e.g., show a success message, clear the form, etc.)
            } else {
                console.error('Error submitting survey:', response.statusText);
                setAppLoading(false);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error submitting survey:', error);
            setAppLoading(false);
        }

        setLoading(false);
        

        
    };

    useEffect(() => {
        const checkSurveyCompletion = async () => {
            try {
                const response = await fetch(`/api/survey/checkSurvey?userId=${userId}`); // replace 'USER_ID' with actual user ID
                const data = await response.json();

                if (data.completed) {
                    router.push('/main');
                }
            } catch (error) {
                console.error('Error checking survey completion:', error);
            }
        };

        checkSurveyCompletion();
    }, [router, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSurvey({ ...survey, [name]: value });
    };

    const handleValueChange = (value) => {
        setSurvey({ ...survey, value });
    };

    if (appLoading) {
        return <Loading />;
    }

    const options = [
        { value: 5, label: 'เยี่ยมสุดๆ', color: '#00D655' },
        { value: 4, label: 'ดี', color: '#B9D21E' },
        { value: 3, label: 'ปานกลาง', color: '#FFC700' },
        { value: 2, label: 'พอใช้', color: '#FF8A00' },
        { value: 1, label: 'แย่', color: '#FF0000' },
    ];

    return (
        <main className="flex items-center justify-center bg-[#0056FF]" style={{ minHeight: "100vh", width: "100%" }}>
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
                                    {options.map((option, idx) => (
                                        <li
                                            key={option.value}
                                            className="relative w-full mb-3"
                                            onClick={() => handleValueChange(option.value)}
                                        >
                                            <div className="relative grid grid-cols-4 justify-center items-center text-left p-2">
                                                <Image
                                                    src={`/images/survey/${option.value}.svg`}
                                                    alt={`Survey Icon ${option.value}`}
                                                    width={50}
                                                    height={50}
                                                    className="absolute mb-3 ml-3"
                                                    style={{ width: "50px", height: "50px" }}
                                                />
                                                <div className={`col-span-3 ml-8 rounded-xl h-8 flex items-center ${survey.value === option.value ? 'ring-1 ring-gray-300' : ''}`} style={{ backgroundColor: survey.value === option.value ? option.color : '#D3D3D3', width: "280px" }}>
                                                    <span className="inline-block ml-8 text-white font-bold">
                                                        {option.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div>
                                    <textarea
                                        name="memo"
                                        placeholder="เพิ่มเติม"
                                        className="w-full h-28 p-2 border border-gray-300 rounded-md"
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
