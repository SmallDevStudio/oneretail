import { useRouter } from "next/router";
import Image from "next/image";
import AppMenu from "@/components/menu/AppMenu";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
export default function Stores() {
    const router = useRouter();

    return (
        <main className="w-full h-full flex justify-center items-center mb-[50px]">
            <div className="w-[100vw] h-full" style={{
                marginBottom: "50px"
            }}>
                <div className="flex flex-col w-full">
                    <Image
                        src={"/dist/img/stores/main.jpg"}
                        alt="Stores"
                        width={600}
                        height={600}
                        priority
                    />

                    <div className="flex flex-row items-end justify-end mr-2 mt-2">
                        <div className="justify-between flex">
                            <div className="flex mr-2 justify-center items-center text-center">
                                <FavoriteBorderOutlinedIcon />
                                <span className="text-sm font-light text-black dark:text-white leading-tight ml-1">
                                    10
                                </span>
                            </div>

                            <div className="flex mr-2 justify-center items-center text-center">
                                <VisibilityOutlinedIcon />
                                <span className="text-sm font-light text-black dark:text-white leading-tight ml-1">
                                    10
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex p-3">
                    <div className="flex flex-col">
                        <h4 className="text-xl font-bold uppercase text-black dark:text-white">
                            Lorem Ipsum
                        </h4>
                        <span className="text-black dark:text-white text-sm font-light">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                        </span>
                    </div>
                </div>

                <div className="flex p-4">
                    <div className="flex flex-row w-full">
                        <div className="w-[50px]">
                            <Image 
                                src={"/dist/img/avatar.png"}
                                alt="Stores"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full border-2 border-gray-300"
                            />
                        </div>

                        <div class="relative w-full ml-2">
                            <textarea
                                className="peer h-full min-h-[30px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                            placeholder="แสดงความคิดเห็น...">
                            </textarea>
                            
                            <div className="justify-end ralative flex items-end">
                                    <div className="justify-between flex">
                                        <button className="text-black dark:text-white text-sm font-light bg-[#0D99FF] p-2 w-20 rounded-full">
                                            โพส
                                        </button>
                                    </div>
                            </div>
                        </div>

                    </div>
                </div>

                <hr className="border-gray-300 dark:border-gray-700 mb-2 mt-8" />

                <div className="flex flex-col p-3 mb-2">

                    <div className="flex flex-row w-full p-2 mb-4">
                        <div className="w-[100px]">
                            <Image 
                                src={"/dist/img/avatar-1.png"}
                                alt="Stores"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full border-2 border-gray-300"
                            />
                        </div>

                        <div className="flex flex-col ml-3" >
                            <span className="text-black dark:text-white text-sm font-light leading-tight">
                                Name Lorem Ipsum
                            </span>
                            <span className="text-black dark:text-white text-xs font-light leading-tight">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row w-full p-2 mb-4">
                        <div className="w-[100px]">
                            <Image 
                                src={"/dist/img/avatar-1.png"}
                                alt="Stores"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full border-2 border-gray-300"
                            />
                        </div>

                        <div className="flex flex-col ml-3" >
                            <span className="text-black dark:text-white text-sm font-light leading-tight">
                                Name Lorem Ipsum
                            </span>
                            <span className="text-black dark:text-white text-xs font-light leading-tight">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row w-full p-2 mb-4">
                        <div className="w-[100px]">
                            <Image 
                                src={"/dist/img/avatar-1.png"}
                                alt="Stores"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full border-2 border-gray-300"
                            />
                        </div>

                        <div className="flex flex-col ml-3" >
                            <span className="text-black dark:text-white text-sm font-light leading-tight">
                                Name Lorem Ipsum
                            </span>
                            <span className="text-black dark:text-white text-xs font-light leading-tight">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row w-full p-2 mb-4">
                        <div className="w-[100px]">
                            <Image 
                                src={"/dist/img/avatar-1.png"}
                                alt="Stores"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full border-2 border-gray-300"
                            />
                        </div>

                        <div className="flex flex-col ml-3" >
                            <span className="text-black dark:text-white text-sm font-light leading-tight">
                                Name Lorem Ipsum
                            </span>
                            <span className="text-black dark:text-white text-xs font-light leading-tight">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            <AppMenu />
        </main>
    );
}