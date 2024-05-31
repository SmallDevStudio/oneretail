import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function UserAvartar() {
    const { data: session } = useSession();
    const image = session?.user?.image;

    return (
        <div className="relative">
            <Image
                src={image}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full border-3 border-[#0056FF] dark:border-white"
            />
        </div>
    );
}