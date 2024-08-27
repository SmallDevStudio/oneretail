import React from "react";

import { AppLayout } from "@/themes";
import SocialClub from "@/components/Custom/SocialClub";

const SocialClubPage = () => {
    return (
        <div>
            <SocialClub />
        </div>
    );
};

export default SocialClubPage;

SocialClubPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
SocialClubPage.auth = true;