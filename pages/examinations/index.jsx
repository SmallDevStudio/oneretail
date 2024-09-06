import React from "react";

import { AppLayout } from "@/themes";

const Examinations = () => {
    return (
        <div>
            <div>
                <h1>Examinations</h1>
            </div>
            <div>
                
            </div>
        </div>
    );
};

export default Examinations;

Examinations.getlayout = (page) => <AppLayout>{page}</AppLayout>;
Examinations.auth = true;