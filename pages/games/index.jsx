import React, { useState, useEffect} from "react";
import { AppLayout } from "@/themes";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function Games() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <div className="relative p-3 mb-20 max-h-[100vh]">
                <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1 gap-14">
                    <div className="relative p-3 ">
                        <div className="flex items-center text-center justify-center p-2 px-1 pz-1 ">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Games Center</span>
                        </div>
                    </div>
                    <div className="flex items-center text-center justify-center" style={{
                        width: "100%",
                    }}>
                        <Link href="/games/quiz">
                            <Image 
                                src={'/images/gamecenter/Asset25.png' }
                                alt="games" 
                                width={100} 
                                height={100} 
                                priority
                                style={{
                                    position: "absolute",
                                    top: "14%",
                                    left: "50%",
                                    zIndex: "1",
                                    width: "120px",
                                    height: "120px",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div className="flex bg-[#0056FF] rounded-3xl items-center justify-center" style={{
                                width: "320px",
                                height: "150px",
                            }}> 
                                <span className="text-xl font-black text-white mt-10">
                                    ตอบคำถามรับพอยท์ประจำวัน
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div 
                        className="flex items-center text-center justify-center p-2 px-1 pz-1"
                    >
                        <Link href="/games/memory-card-game">
                            <Image 
                                src={'/images/gamecenter/Asset24.png'}
                                alt="games" 
                                width={150} 
                                height={150} 
                                className="relative w-full h-full"
                                priority
                                style={{
                                    position: "absolute",
                                    top: "42%",
                                    left: "50%",
                                    zIndex: "1",
                                    width: "120px",
                                    height: "120px",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div className="flex bg-[#f68b1f] rounded-3xl items-center justify-center " style={{
                                width: "320px",
                                height: "150px",
                            }}> 
                                <span className="text-xl font-black text-white mt-10">
                                    จับคู่รับพอยท์ 
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center text-center justify-center p-2 px-1 pz-1">
                        <Link href="#">
                            <Image 
                                src={'/images/gamecenter/Asset23.png'} 
                                alt="games" 
                                width={150} 
                                height={150} 
                                className="relative w-full h-full"
                                priority
                                style={{
                                    position: "absolute",
                                    bottom: "14%",
                                    left: "50%",
                                    zIndex: "1",
                                    width: "120px",
                                    height: "120px",
                                    transform: "translateX(-50%)",
                                }}
                            />
                            <div className="flex bg-[#29345f] rounded-3xl items-center justify-center" style={{
                                width: "320px",
                                height: "150px",
                            }}> 
                                <span className="text-xl font-black text-white mt-10">
                                    เร็วๆนี้ 
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {open && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">ขออภัย</span>
                            <span className="text-[25px] font-black text-black dark:text-white">เกมส์นี้อยู่ในระหว่างปรับปรุง</span>
                            <div className="flex items-center text-center justify-center mt-5">
                                <button
                                    className="flex items-center text-center justify-center px-4 pz-2 bg-[#F2871F] rounded-3xl"
                                    onClick={handleClose}
                                >
                                    <span className="text-md font-black text-white">ตกลง</span>
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </>  
    );
}

Games.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Games.auth = true;

