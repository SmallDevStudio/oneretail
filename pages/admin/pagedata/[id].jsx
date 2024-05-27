import { AdminLayout } from "@/themes"
import Edit from "@/components/admin/learning/Edit"

const EditPage = ({ params }) => {

    return <Edit />;
}

EditPage.getLayout = function getLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default EditPage;