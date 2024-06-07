import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import { AppLayout } from "@/themes";
import { useSession } from "next-auth/react";

export default function QuizGame() {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    return (
        <Provider store={store}>
            <div className="flex flex-col items-center text-center justify-center bg-blue-500 pb-20" style={{ minHeight: "100vh", width: "100%" }}>
                <div className="flex items-center text-center justify-center p-5 bg-white w-full">
                    <span className="text-[35px] font-black text-[#0056FF]">Games</span>
                </div>
                <div className="relative flex flex-col p-5 bg-blue-500 w-full">
                    <div className="relative bg-white rounded-xl shadow-md border-2 p-3 px-2 min-h-[80vh] w-full mb-5">
                        <Quiz userId={userId} />
                    </div>
                </div>
            </div>

        </Provider>
    );
}

QuizGame.getLayout = (page) => <AppLayout>{page}</AppLayout>;
QuizGame.auth = true;