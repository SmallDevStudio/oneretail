import { AdminLayout } from "@/themes"
import Edit from "@/components/admin/learning/Edit"
const EditPage = ({ params }) => {
    const { id } = params
    console.log ('id:', id);

    return <Edit />;
}

UpdateLearning.getLayout = function getLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default EditPage;