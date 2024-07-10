import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TipTap from "../TipTap";

const AddArticleForm = () => {
    const { data: session } = useSession();

    const router = useRouter();

    return (
        <div>
            <TipTap />
        </div>
    );
}

export default AddArticleForm;
