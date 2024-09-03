import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { IoIosArrowBack } from "react-icons/io";

const Satisfaction = () => {
    const [satisfied, setSatisfied] = useState(0);
    const [recommend, setRecommend] = useState('');
    const [showRecommend, setShowRecommend] = useState(false);
    const [featureLike, setFeatureLike] = useState([]);
    const [improved, setImproved] = useState([]);
    const [featuresAdd, setFeaturesAdd] = useState('');
    const [problems, setProblems] = useState('');
    const [showProblems, setShowProblems] = useState(false);
    const [suggestions, setSuggestions] = useState('');

    // Error states for each field
    const [recommendError, setRecommendError] = useState(null);
    const [featureLikeError, setFeatureLikeError] = useState(null);
    const [problemsError, setProblemsError] = useState(null);

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const checkUserTeamGrop = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axios.get(`/api/satisfactions/user?userId=${session.user.id}`);
                    console.log(response.data.data.teamGrop);
                    if (response.data.success && response.data.data.teamGrop === 'TCON' || 
                        response.data.data.teamGrop === 'PB' || 
                        response.data.data.teamGrop === 'CRSG' ||
                        response.data.data.teamGrop === null) {
                        router.push('/main');
                        return;
                    } 
                } catch (error) {
                    console.error('Error checking team group:', error);
                }
            }
        };

        checkUserTeamGrop();
    }, [session, router]);

    useEffect(() => {
        const checkUserSatisfaction = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axios.get(`/api/satisfactions/${session.user.id}`);
                    if (response.data.success && response.data.data.length > 0) {
                        router.push('/main');; // If satisfaction data exists, go back to the previous page
                    }
                } catch (error) {
                    console.error('Error checking satisfaction:', error);
                }
            }
        };

        checkUserSatisfaction();
    }, [router, session]);

    const handleChangeLike = (event) => {
        const { value } = event.target;
        if (featureLike.includes(value)) {
            setFeatureLike(featureLike.filter((item) => item !== value));
        } else {
            setFeatureLike([...featureLike, value]);
        }
    };

    const handleChangeImproved = (event) => {
        const { value } = event.target;
        if (improved.includes(value)) {
            setImproved(improved.filter((item) => item !== value));
        } else {
            setImproved([...improved, value]);
        }
    };

    const handleSubmit = async () => {
        let hasError = false;

        if (showRecommend && recommend === '') {
            setRecommendError('กรุณาใส่ข้อความ');
            hasError = true;
        } else {
            setRecommendError(null);
        }

        if (featureLike.length === 0) {
            setFeatureLikeError('กรุณาเลือกฟีเจอร์ใดที่คุณชอบมากที่สุด');
            hasError = true;
        } else {
            setFeatureLikeError(null);
        }

        if (showProblems && problems === '') {
            setProblemsError('กรุณาใส่ข้อความ');
            hasError = true;
        } else {
            setProblemsError(null);
        }

        if (hasError) return;

        const survey = {
            userId: session.user.id,
            satisfied,
            recommend,
            featureLike,
            improved,
            featuresAdd,
            problems,
            suggestions
        };

        try {
            const response = await axios.post('/api/satisfactions', survey);

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสําเร็จ',
                    text: 'ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#00D655',
                }).then(() => {
                    router.push('/main');
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-4">
            <div className="flex flex-row justify-between items-center w-full mt-5 mb-4">
               <div className="flex items-center cursor-pointer" 
                    >
                    
               </div>
                <span className="flex text-3xl font-bold text-white">แบบสอบถาม</span>
                <div></div>
            </div>
            <div className="flex flex-col w-full gap-2 bg-white rounded-lg p-4">
                <div className="flex flex-col text-sm gap-2">
                    <span className="font-bold">
                        1. คุณพึงพอใจกับการใช้งาน One Retail Society โดยรวมมากน้อยแค่ไหน? 
                        <span className="text-xs font-normal ml-1">(5 คือ พึงพอใจมากที่สุด)</span>
                    </span>
                    <div className="flex flex-col mb-2">
                        <ul className="flex flex-row justify-between items-center">
                            <li>
                                <div
                                    className={`text-white px-2 rounded-md w-10 h-5 flex justify-center items-center 
                                        ${satisfied === 5 ? "bg-[#00D655]" : "bg-gray-400"}`}
                                    onClick={() => setSatisfied(5)}
                                >
                                    <span>5</span>
                                </div>
                            </li>
                            <li>
                                <div
                                    className={`text-white px-2 rounded-md w-10 h-5 flex justify-center items-center 
                                        ${satisfied === 4 ? "bg-[#B9D21E]" : "bg-gray-400"}`} 
                                    onClick={() => setSatisfied(4)}
                                >
                                    <span>4</span>
                                </div>
                            </li>
                            <li>
                                <div 
                                    className={`text-white px-2 rounded-md w-10 h-5 flex justify-center items-center 
                                    ${satisfied === 3 ? "bg-[#FFC700]" : "bg-gray-400"}`} 
                                    onClick={() => setSatisfied(3)}
                                >
                                    <span>3</span>
                                </div>
                            </li>
                            <li>
                                <div
                                    className={`text-white px-2 rounded-md w-10 h-5 flex justify-center items-center 
                                    ${satisfied === 2 ? "bg-[#FF8A00]" : "bg-gray-400"}`}  
                                    onClick={() => setSatisfied(2)}>
                                    <span>2</span>
                                </div>
                            </li>
                            <li>
                                <div 
                                    className={`text-white px-2 rounded-md w-10 h-5 flex justify-center items-center 
                                    ${satisfied === 1 ? "bg-[#FF0000]" : "bg-gray-400"}`} 
                                    onClick={() => setSatisfied(1)}>
                                    <span>1</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <span className="font-bold">
                        2. คุณจะแนะนำ One Retail Society ของเราให้ผู้อื่นหรือไม่?
                    </span>
                    <ul className="flex flex-row justify-evenly mb-2">
                        <li>
                            <div 
                                className={`text-white px-2 rounded-md w-20 h-5 flex justify-center items-center ${showRecommend ? "bg-green-500" : "bg-gray-400"}`}
                                onClick={() => setShowRecommend(true)}
                            >
                                <span>ใช่</span>
                            </div>
                        </li>
                        <li>
                            <div 
                                className={`text-white px-2 rounded-md w-20 h-5 flex justify-center items-center ${!showRecommend ? "bg-red-500" : "bg-gray-400"}`}
                                onClick={() => setShowRecommend(false)}
                            >
                                <span>ไม่</span>
                            </div>
                        </li>
                    </ul>
                    {showRecommend && (
                        <>
                            <textarea
                                rows={4}
                                cols={50}
                                name="recommend"
                                id="recommend"
                                placeholder="เขียนในสื่งที่คุณอยากแนะนำ"
                                onChange={(e) => setRecommend(e.target.value)}
                                value={recommend}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                            />
                            {recommendError && <span className="text-red-500 text-xs">***{recommendError}</span>}
                        </>
                    )}

                    <div className="flex flex-col">
                        <span className="font-bold">
                            3. ฟีเจอร์ใดที่คุณชอบมากที่สุดใน One Retail Society?
                        </span>
                        <span className="text-xs">(เลือกได้มากกว่า 1 ข้อ)</span>
                    </div>
                    <div className="relative flex-row mb-2">
                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="1"
                                id="1"
                                value="1"
                                onChange={(e) => handleChangeLike(e)}
                            />
                            <label htmlFor="1">ตารางอบรม</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="2"
                                id="2"
                                value="2"
                                onChange={(e) => handleChangeLike(e)}
                            />
                            <label htmlFor="2">เกม</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="3"
                                id="3"
                                value="3"    
                                onChange={(e) => handleChangeLike(e)}
                            />
                            <label htmlFor="3">Learn มันส์</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="4"
                                id="4"
                                value="4"    
                                onChange={(e) => handleChangeLike(e)}
                            />
                            <label htmlFor="4">Success Story</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="5"
                                id="5"
                                value="5"  
                                onChange={(e) => handleChangeLike(e)}
                            />
                            <label htmlFor="5">ตารางอันดับ</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="6"
                                id="6"
                                value="6"  
                                onChange={(e) => handleChangeLike(e)} 
                            />
                            <label htmlFor="6">One Retail Club</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="7"
                                id="7"
                                value="7"  
                                onChange={(e) => handleChangeLike(e)} 
                            />
                            <label htmlFor="7">แลกของรางวัล</label>
                        </div>
                    </div>
                    {featureLikeError && <span className="text-red-500 text-xs">***{featureLikeError}</span>}

                    <div className="flex flex-col">
                        <span className="font-bold">
                            4. ฟีเจอร์ใดที่คุณคิดว่าควรปรับปรุง?
                        </span>
                        <span className="text-xs">(เลือกได้มากกว่า 1 ข้อ)</span>
                    </div>
                    <div className="relative flex-row gap-2 mb-2">
                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="1"
                                id="1"
                                value="1"
                                onChange={(e) => handleChangeImproved(e)}
                            />
                            <label htmlFor="1">ตารางอบรม</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="2"
                                id="2"
                                value="2"
                                onChange={(e) => handleChangeImproved(e)}
                            />
                            <label htmlFor="2">เกม</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="3"
                                id="3"
                                value="3"    
                                onChange={(e) => handleChangeImproved(e)}
                            />
                            <label htmlFor="3">Learn มันส์</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="4"
                                id="4"
                                value="4"    
                                onChange={(e) => handleChangeImproved(e)}
                            />
                            <label htmlFor="4">Success Story</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="5"
                                id="5"
                                value="5"  
                                onChange={(e) => handleChangeImproved(e)}
                            />
                            <label htmlFor="5">ตารางอันดับ</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="6"
                                id="6"
                                value="6"  
                                onChange={(e) => handleChangeImproved(e)} 
                            />
                            <label htmlFor="6">One Retail Club</label>
                        </div>

                        <div className="flex flex-row gap-1">
                            <input 
                                type="checkbox" 
                                name="7"
                                id="7"
                                value="7"  
                                onChange={(e) => handleChangeImproved(e)} 
                            />
                            <label htmlFor="7">แลกของรางวัล</label>
                        </div>
                    </div>

                    <span className="font-bold">
                        5. มีฟีเจอร์อื่นๆ ที่คุณอยากให้เราเพิ่มหรือไม่?
                    </span>
                    <textarea
                        rows={4}
                        name="featuresAdd"
                        id="featuresAdd"
                        placeholder="เขียนในสื่งที่คุณอยากให้เพิ่ม"
                        onChange={(e) => setFeaturesAdd(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none mb-2"
                        >
                    </textarea>

                    <span className="font-bold">
                        6.คุณเคยเจอปัญหาในการใช้งาน One Retail Society บ้างไหม? ถ้ามี โปรดระบุ
                    </span>
                    <ul className="flex flex-row justify-evenly mb-2">
                        <li>
                            <div 
                                className={`text-white px-2 rounded-md w-20 h-5 flex justify-center items-center ${showProblems ? "bg-green-500" : "bg-gray-400"}`}
                                onClick={() => setShowProblems(true)}
                            >
                                <span>มี</span>
                            </div>
                        </li>
                        <li>
                            <div 
                                className={`text-white px-2 rounded-md w-20 h-5 flex justify-center items-center ${!showProblems ? "bg-red-500" : "bg-gray-400"}`}
                                onClick={() => setShowProblems(false)}
                            >
                                <span>ไม่มี</span>
                            </div>
                        </li>
                    </ul>
                    {showProblems && (
                        <>
                            <textarea
                                rows={4}
                                name="problems"
                                id="problems"
                                placeholder="เขียนในสื่งที่คุณเจอปัญหา"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none mb-2"
                                onChange={(e) => setProblems(e.target.value)}
                            />
                            {problemsError && <span className="text-red-500 text-xs">***{problemsError}</span>}
                        </>
                    )}

                    <span className="font-bold">
                        7. คุณมีข้อเสนอแนะอะไรที่จะช่วยให้ One Retail Society ดีขึ้น? 
                    </span>
                    <textarea
                        rows={4}
                        name="suggestions"
                        id="suggestions"
                        placeholder="เขียนในสื่งที่คุณเสนอแนะ"
                        onChange={(e) => setSuggestions(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                        >
                    </textarea>
                </div>

                <div className="flex justify-center gap-2 w-full mt-4">
                    <button
                        className="w-full p-2 text-white bg-[#0056FF] rounded-3xl"
                        onClick={handleSubmit}
                    >
                        ส่งแบบสอบถาม
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Satisfaction;
