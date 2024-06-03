import Quiz from "@/components/Quiz";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import QuestionTable from "@/components/QuestionTable";

export default function QuizGame() {
    return (

        <Provider store={store}>
            <div>
                <QuestionTable />
            </div>
        </Provider>

    
    );
}