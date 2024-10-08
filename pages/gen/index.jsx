import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/themes';
import { Divider } from '@mui/material';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const LearningGen = () => {
    const [user, setUser] = useState(null);

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data: users, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher, {
        onSuccess: (data) => {
            setUser(data?.user);
        }
    });

    console.log(user);

    return (
        <div className="flex-1 flex-col w-full mb-20 px-4 min-h-[80vh]">
            {/* User Panel */}
            <div className='flex flex-col justify-center items-center w-full p-2 mt-5'>
                <div className='flex flex-row gap-2 bg-gray-100 p-2 w-[300px] rounded-md'>
                    <div className='flex flex-col items-center justify-center w-full'>
                        <span className='text-xl text-[#0056FF] font-bold'>{user?.fullname}</span>
                        <span className='text-xl text-[#F2871F] font-bold'>{user?.position}</span>
                    </div>
                    <div className='flex flex-col items-center justify-center w-[120px]'>
                        <Image
                            src={user?.pictureUrl}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="rounded-full bg-gray-300 p-1"
                            style={{
                                width: "80px",
                                height: "80px",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col mt-5">
                <h1 className="text-3xl font-bold text-[#0056FF]">Personalized</h1>
                <h1 className="text-3xl font-bold text-[#F2871F]">Learning</h1>
            </div>

            <Divider 
                className='my-2'
                sx={{
                    borderColor: '#0056FF',
                    height: '1px',
                    width: '100%',
                    margin: '10px 0', 
                }}
            />

            {/* Content */}
            <div className="flex flex-col mt-5 gap-5">
                <button 
                    className='bg-[#0056FF] text-white text-2xl font-bold py-10 px-4 rounded-md'
                >
                    New Joiner
                </button>

                <button 
                    className='bg-[#0056FF] text-white text-2xl font-bold py-10 px-4 rounded-md'
                >
                    CYC
                </button>

                <button 
                    className='bg-[#0056FF] text-white text-2xl font-bold py-10 px-4 rounded-md'
                >
                    housing load
                </button>
            </div>
        </div>
    );
};

export default LearningGen;

LearningGen.getLayout = (page) => <AppLayout>{page}</AppLayout>;
LearningGen.auth = true;