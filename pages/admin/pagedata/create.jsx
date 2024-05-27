import { AdminLayout } from "@/themes";
import Add from "@/components/admin/learning/Add";
const CreateLearning = () => {
    return (
        <div className="p-5 w-[50%] justify-center items-center">
            <Add />
        </div>
    );
}

CreateLearning.getLayout = function getLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default CreateLearning;