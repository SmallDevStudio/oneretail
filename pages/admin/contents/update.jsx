import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import FormEdit from "@/components/admin/formTable/contents/FormEdit";

const fetcher = (url) => fetch(url).then((res) => res.json());

const UpdateContents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [contents, setContents] = useState(null);

    const { data, error } = useSWR(() => id ? `/api/content/${id}` : null, fetcher, {
        onSuccess: (data) => {
            setContents(data.data);
        },
    });

    if (!contents) return <div>Loading...</div>;

    return (
        <React.Fragment>
            <FormEdit initialData={contents} />
        </React.Fragment>
    );
};

export default UpdateContents;