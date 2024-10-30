import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import { AppLayout } from "@/themes";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

const fetcher = url => axios.get(url).then(res => res.data);

export default function QuizGame() {
    const [user, setUser] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUser(response.data.user);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [userId]);
    // ดึงข้อมูล questions หลังจากได้ข้อมูล user
    useEffect(() => {
        const fetchQuestions = async () => {
            if (user) {
                try {
                    const { teamGrop, position } = user;
                    const group = teamGrop === "Retail" ? "BBD" : teamGrop;
    
                    const response = await axios.get(`/api/quiz/game`, {
                        params: { group }
                    });
    
                    // Check if there are any questions with subGroup matching position
                    const filteredQuestions = response.data.data.filter((quiz) => 
                        quiz.group === group && (!quiz.subGroup || quiz.subGroup.split('_').includes(position))
                    );
    
                    // If no filtered questions match, fallback to fetching all questions for the group
                    setAllQuestions(filteredQuestions.length > 0 ? filteredQuestions : response.data.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchQuestions();
    }, [user]);

    console.log(allQuestions);

    if (!user || !allQuestions) return <Loading />;

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
