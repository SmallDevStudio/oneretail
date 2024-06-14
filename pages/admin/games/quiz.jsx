import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import QuestionTable from "@/components/QuestionTable";
import { AdminLayout } from "@/themes";

export default function QuizGame() {
    return (

        <Provider store={store}>
            <div>
                <QuestionTable />
            </div>
        </Provider>

    
    );
}

QuizGame.auth = true;
QuizGame.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;