import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";

const Forms = () => {
    return (
        <div>
            <h1>Forms</h1>
        </div>
    );
};

export default Forms;

Forms.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
Forms.auth = true;