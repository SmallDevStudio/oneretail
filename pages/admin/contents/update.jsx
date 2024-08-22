import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import FormEdit from "@/components/admin/formTable/contents/FormEdit";
import Loading from "@/components/Loading";
import { AdminLayout } from "@/themes";

const fetcher = (url) => fetch(url).then((res) => res.json());

const UpdateContents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [contents, setContents] = useState(null);

    const { data, error } = useSWR(() => id ? `/api/content/edit/${id}` : null, fetcher, {
        onSuccess: (data) => {
            setContents(data);
        },
    });

    if (!contents) return <Loading />;

    return (
        <React.Fragment>
            <FormEdit initialData={contents} />
        </React.Fragment>
    );
};

UpdateContents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

UpdateContents.auth = true;

export default UpdateContents;