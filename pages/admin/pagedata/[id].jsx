import { AdminLayout } from "@/themes"
import Edit from "@/components/admin/learning/Edit"
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const getPageById = async (id) => {
    try {
        const response = await fetch(`/api/learning/${id}`, {
            cache: 'no-store',
        });
        const data = response.json();
        if (!data) {
            throw new Error('Data not found');
        }
    
    } catch (error) {
        console.log(error);
    }
}

const EditPage = async() => {
    const router = useRouter();
    const { id } = router.query;
    const data = await getPageById(id);
    console.log('data:', data);

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