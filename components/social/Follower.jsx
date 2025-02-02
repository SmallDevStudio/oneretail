import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { IoPersonAdd } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import Swal from "sweetalert2";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Follower({ targetId }) {
    const [hasFollowed, setHasFollowed] = useState(false);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    const { data: followData, error: followError, isValidating: followValidating, mutate: followMutate } = useSWR(() => userId ? `/api/onesociety/follower/check?userId=${userId}&targetId=${targetId}` : null, fetcher);

    useEffect(() => {
        if (!followData) return;
        if (followData?.data?.type === 'follow') {
            setHasFollowed(true);
        } else {
            setHasFollowed(false);
        }
    }, [followData]);

    const handleFollow = async () => {
        const followType = hasFollowed ? 'unfollow' : 'follow';

        try {
            const response = await axios.post('/api/onesociety/follower', { userId, targetId, type: followType });
            const follwerId = response.data.data._id;
            if (response.data.data.type === 'unfollow') {
                await Swal.fire({
                    icon: 'success',
                    title: 'ดําเนินการสําเร็จ',
                    text: 'คุณได้ยกเลิกการติดตาม',
                    showConfirmButton: false,
                    timer: 1500
                })
                setHasFollowed(false);
                followMutate();
            }else{
                const userRes = await axios.get(`/api/users/${userId}`);
                await axios.post('/api/notifications', {
                    userId: targetId,
                    senderId: userId,
                    description: `${userRes.data.user.fullname} ได้ติดตามคุณ`,
                    referId: follwerId,
                    path: 'follow',
                    subpath: '',
                    url: `${window.location.origin}p/${userId}`,
                    type: 'follow'
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'ดําเนินการสําเร็จ',
                    text: 'คุณได้ติดตาม',
                    showConfirmButton: false,
                    timer: 1500
                })
                setHasFollowed(true);
                followMutate();
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    return (hasFollowed ? (
                <div 
                    onClick={handleFollow} 
                    className="flex flex-row px-4 py-1 bg-[#0056FF] text-white text-[10px] rounded-full items-center gap-1 cursor-pointer"
                >
                    <IoPerson size={15} />
                    <span className="font-bold">ติดตามแล้ว</span>
                </div>
            ): (
                <div 
                    onClick={handleFollow} 
                    className="flex flex-row px-4 py-1 bg-gray-200 text-[10px] rounded-full items-center gap-1 cursor-pointer"
                >
                    <IoPersonAdd size={15} />
                    <span className="font-bold">ติดตาม</span>
                </div>
            )
    );
}