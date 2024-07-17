import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Tiptap from "../TipTap/Tiptap";

const AddArticleForm = () => {
    const { data: session } = useSession();

    const router = useRouter();

    const onChange = async (newContent) => {
        console.log(newContent);
    };

    return (
        <div>
            <Tiptap onChange={onChange}/>
        </div>
    );
}

export default AddArticleForm;
