import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Loading from '@/components/Loading';

const StickerTable = () => {
    const { data: session } = useSession();
    const router = useRouter();


    return (
        <div>
            Sticker Table
        </div>
    );
}

export default StickerTable;