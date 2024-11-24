import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { RiCoinsFill } from "react-icons/ri";
import { TiPointOfInterest } from "react-icons/ti";
import { AppLayout } from "@/themes";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);

    const { data: session } = useSession();
    const router = useRouter();
    const { userId } = router.query;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/profile/${userId}`);
                setUserData(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    console.log("userData:", userData);

    return (
        <div className="flex flex-col bg-gray-50 w-full min-h-screen">
            <div>
                <div className="flex bg-[#0056FF] w-full min-h-[120px]">

                </div>
                {/* Header */}
                <div className="flex justify-center w-full">
                    <div className="relative flex flex-col justify-center items-center top-[-50px]">
                        <Image
                            src={userData?.user.pictureUrl}
                            alt="Profile"
                            width={200}
                            height={200}
                            className="inline rounded-full"
                            priority
                            style={{
                                width: "90px",
                                height: "90px",
                            }}
                        />
                        <span className="font-bold mt-2">{userData?.user.fullname}</span>

                        <div className="flex flex-row items-center gap-2 text-xs mt-2">
                            <div className="bg-[#0056FF] text-white rounded-lg px-2 py-1">
                                <span><strong>EmpId:</strong> {userData?.user.empId}</span>
                            </div>
                            <div className="flex-row gap-1 items-center bg-gray-100 rounded-lg px-2 py-1">
                                <MdOutlineMail size={15}/>
                            </div>
                        </div>
                        
                        {/* Point & Coins */}
                        {userData.user.userId === session.user.id && (
                            <div className="flex flex-row items-center gap-2 text-xs mt-2">
                                <div className="flex flex-row gap-1 items-center bg-gray-100 rounded-xl px-2 py-1">
                                    <span className="font-bold">Point:</span>
                                    <span>{userData?.points.point}</span>
                                </div>
                                <div className="flex flex-row gap-1 items-center bg-gray-100 rounded-xl px-2 py-1">
                                    <span className="font-bold">Coins:</span>
                                    <span>{userData?.coins.coins}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap flex-row gap-2 text-[10px] mt-2 bg-gray-100 py-2 px-1">
                            <div className="bg-gray-300 rounded-lg px-2 py-1">
                                <span><strong>TeamGroup:</strong> {userData?.emp.teamGrop}</span>
                            </div>
                            {userData?.emp?.chief_th && (
                                <div className="bg-gray-300 rounded-lg px-2 py-1">
                                    <span><strong>Chief_th:</strong> {userData?.emp.chief_th}</span>
                                </div>
                            )}
                            {userData?.emp?.position && (
                                <div className="bg-gray-300 rounded-lg px-2 py-1">
                                    <span><strong>Position:</strong> {userData?.emp.position}</span>
                                </div>
                            )}
                            {userData?.emp?.group && (
                                <div className="bg-gray-300 rounded-lg px-2 py-1">
                                    <span><strong>Group:</strong> {userData?.emp.group}</span>
                                </div>
                            )}
                            {userData?.emp?.department && (
                                <div className="bg-gray-300 rounded-lg px-2 py-1">
                                    <span><strong>Department:</strong> {userData?.emp.department}</span>
                                </div>
                            )}
                            {userData?.emp?.branch && (
                                <div className="bg-gray-300 rounded-lg px-2 py-1">
                                    <span><strong>Branch:</strong> {userData?.emp.branch}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex text-sm mt-2 justify-center w-full">
                            <div className="flex bg-[#0056FF] rounded-xl px-2 py-1 w-2/3 justify-center items-center">
                                <span className="font-bold text-white">+ Post</span>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Post */}
                 <div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

ProfilePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
ProfilePage.auth = true;