import { useState } from "react";
import { AppLayout } from "@/themes";

const NewJoiner = () => {
    return (
        <div>
            NewJoiner
        </div>
    )
}

export default NewJoiner;

NewJoiner.getLayout = (page) => <AppLayout>{page}</AppLayout>
NewJoiner.auth = true