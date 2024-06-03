import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import { AppLayout } from "@/themes";
import { useSession } from "next-auth/react";

export default function QuizGame() {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    console.log('userId:', userId);

    return (
        <Provider store={store}>
            <div className="relative p-3top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Games</span>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center p-2 bg-blue-500 h-[90vh]">
                <div className="relative bg-white rounded-lg shadow-md border-2 p-5 h-[70vh] w-[80vw] mt-[-50px]">
                    <Quiz userId={userId}/>
                </div>
            </div>

        </Provider>
    );
}

QuizGame.getLayout = (page) => <AppLayout>{page}</AppLayout>;
QuizGame.auth = true;