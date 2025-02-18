import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

export default function Share() {
    const router = useRouter();
    const { fileId, anonymous } = router.query;
    const { data: session, status } = useSession();
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (status === "loading") return;
        if (fileId) fetchFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, fileId]);

    const fetchFile = async () => {
        try {
            const response = await axios.get(`/api/library/${fileId}`);
            setFile(response.data.data);
        } catch (error) {
            console.error("Error fetching file:", error);
            router.push("/404");
        }
    };

    const handleDownload = async () => {
        try {
            await axios.post('/api/share', {
                fileId,
                userId: session?.user?.id || null,
                anonymous: !!anonymous
            });

            return router.push(file.url);

        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    useEffect(() => {
        if (file) handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

}
