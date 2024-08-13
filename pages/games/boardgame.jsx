import React from "react";
import { AppLayout } from "@/themes";
import { useRouter } from "next/router";

const BoardGame = () => {
    const router = useRouter();
    
    return (
        <div>
            Board Games
        </div>
    );
};

BoardGame.getLayout = (page) => <AppLayout>{page}</AppLayout>;
BoardGame.auth = true;

export default BoardGame;