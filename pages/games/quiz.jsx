import { useState, useEffect } from "react";
import axios from "axios";
import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import { AppLayout } from "@/themes";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

export default function QuizGame() {
    const [user, setUser] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        if (userId) fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const response = await axios.get(`/api/quiz/game`);

                // ตรวจสอบข้อมูลก่อนกรอง
                console.log("Fetched data:", response.data.data);

                const { teamGrop, position } = user;
                const userGroup = user.teamGrop === "Retail" ? "BBD" : user.teamGrop;

                const isGroupMatch = (quizGroup, userGroup) => {
                    // ตรวจสอบว่าค่าของ userGroup ตรงกับส่วนหนึ่งของ quizGroup หรือไม่
                    return quizGroup.split("_").includes(userGroup);
                };

                const isSubGroupMatch = (quizSubGroup, userPosition) => {
                    if (!quizSubGroup) return true; // ไม่มี subGroup ให้ถือว่า match
                    // ตรวจสอบว่าค่าของ userPosition ตรงกับส่วนหนึ่งของ quizSubGroup หรือไม่
                    return quizSubGroup.split("_").includes(userPosition);
                };

                // ฟิลเตอร์คำถามด้วยเงื่อนไขที่ปรับปรุงใหม่
                const filteredQuestions = response.data.data.filter((quiz) => {
                    const groupMatch = isGroupMatch(quiz.group, userGroup);
                    const subGroupMatch = isSubGroupMatch(quiz.subGroup, user.position);

                    console.log(`Quiz Group: ${quiz.group} | Quiz SubGroup: ${quiz.subGroup}`);
                    console.log(`User TeamGroup: ${user.teamGrop} | User Position: ${user.position}`);
                    console.log(`Group Match: ${groupMatch} | SubGroup Match: ${subGroupMatch}`);

                    // กรองคำถามที่ตรงกับ group และ subGroup (ถ้ามี) หรือถ้า group ตรงแต่ไม่มี subGroup
                    return groupMatch && (!quiz.subGroup || subGroupMatch);
                });

                // หากไม่มีคำถามตรงกับทั้ง group และ subGroup ดึงเฉพาะ group ที่ตรง
                const resultQuestions = filteredQuestions.length > 0 
                    ? filteredQuestions 
                    : response.data.data.filter((quiz) => isGroupMatch(quiz.group, userGroup));

                // หากยังไม่มีคำถามที่ตรงกับ group ใด ๆ ให้ดึงคำถามทั้งหมด
                setAllQuestions(resultQuestions.length > 0 ? resultQuestions : response.data.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [user]);

    if (loading) return <Loading />;

    return (
        <Provider store={store}>
            <div className="flex flex-col items-center text-center justify-center bg-blue-500 pb-20" style={{ width: "100%" }}>
                <div className="flex items-center text-center justify-center p-5 bg-white w-full">
                    <span className="text-[35px] font-black text-[#0056FF]">Games</span>
                </div>
                <div className="relative flex flex-col p-5 bg-blue-500 w-full h-full" style={{
                    backgroundImage: "url('/images/BGgame/Asset14.png')",
                    backgroundSize: "cover",
                }}>
                    <div className="relative bg-white rounded-xl shadow-md border-2 p-3 px-2 min-h-[80vh] w-full mb-5">
                        <Quiz userId={userId} user={user} allQuestions={allQuestions} />
                    </div>
                </div>
            </div>
        </Provider>
    );
}

QuizGame.getLayout = (page) => <AppLayout>{page}</AppLayout>;
QuizGame.auth = true;
