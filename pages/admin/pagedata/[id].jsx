import { AdminLayout } from "@/themes"
import Edit from "@/components/admin/learning/Edit"
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const getPageById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/pages/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = response.json;
        if (!data) {
            throw new Error('Data not found');
        }
        console.log('data:', data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const EditPage = () => {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

    if (!id) {
        return <div>Loading...</div>;
    }
    const getData = async () => {
        const data = await getPageById(id);
        return data;
    }

    console.log(getData());
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