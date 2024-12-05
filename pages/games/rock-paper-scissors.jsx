import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";

const RockPaperScissorsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <>
            <RockPaperScissors 
                userId={session.user.id} 
            />
        </>
    );
}

export default RockPaperScissorsPage;

RockPaperScissorsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
RockPaperScissorsPage.auth = true;