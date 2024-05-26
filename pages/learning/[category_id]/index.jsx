import { useRouter } from "next/router";
import Image from "next/image";
import AppMenu from "@/components/menu/AppMenu";
import Link from "next/link";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
export default function Categories() {
    const router = useRouter();

    return (
        <main className="w-full h-full flex justify-center items-center">
            <div className="w-[100vw] h-full" style={{
                marginBottom: "50px"
            }}>
                <div>
                    <Image
                        src={"/dist/img/stores/main.jpg"}
                        alt="Stores"
                        width={500}
                        height={500}
                        priority
                    />
                </div>

                <div className="p-3">
                    <h1 className="text-3xl font-bold uppercase text-black dark:text-white">
                        {router.query.catid}
                    </h1>

                    <Link href="/stores/cyb/1" className="w-full text-black dark:text-white no-underline">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-2 bg-gray-400 p-2 rounded-xl justify-center mb-3">
                                <div className="w-full">
                                    <div className="h-[150px] bg-gray-100 justify-center items-center text-center flex rounded-xl">
                                        <svg className="w-15 h-15 text-gray-800 dark:text-white text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col ml-3">
                                    <span className="text-xl font-bold uppercase text-black dark:text-white">
                                        Success Story
                                    </span>
                                    <span className="text-sm font-light text-black dark:text-white leading-tight">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>

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
                            </div>
                        </div>
                    </Link>

                    <Link href="/stores/cyb/1" className="w-full text-black dark:text-white no-underline">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-2 bg-gray-400 p-2 rounded-xl justify-center mb-3">
                                <div className="w-full">
                                    <div className="h-[150px] bg-gray-100 justify-center items-center text-center flex rounded-xl">
                                        <svg className="w-15 h-15 text-gray-800 dark:text-white text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col ml-3">
                                    <span className="text-xl font-bold uppercase text-black dark:text-white">
                                        Success Story
                                    </span>
                                    <span className="text-sm font-light text-black dark:text-white leading-tight">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>

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
                            </div>
                        </div>
                    </Link>

                    <Link href="/stores/cyb/1" className="w-full text-black dark:text-white no-underline">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-2 bg-gray-400 p-2 rounded-xl justify-center mb-3">
                                <div className="w-full">
                                    <div className="h-[150px] bg-gray-100 justify-center items-center text-center flex rounded-xl">
                                        <svg className="w-15 h-15 text-gray-800 dark:text-white text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col ml-3">
                                    <span className="text-xl font-bold uppercase text-black dark:text-white">
                                        Success Story
                                    </span>
                                    <span className="text-sm font-light text-black dark:text-white leading-tight">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>

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
                            </div>
                        </div>
                    </Link>


                    <Link href="/stores/cyb/1" className="w-full text-black dark:text-white no-underline">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-2 bg-gray-400 p-2 rounded-xl justify-center mb-3">
                                <div className="w-full">
                                    <div className="h-[150px] bg-gray-100 justify-center items-center text-center flex rounded-xl">
                                        <svg className="w-15 h-15 text-gray-800 dark:text-white text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col ml-3">
                                    <span className="text-xl font-bold uppercase text-black dark:text-white">
                                        Success Story
                                    </span>
                                    <span className="text-sm font-light text-black dark:text-white leading-tight">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>

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
                            </div>
                        </div>
                    </Link>

                    <Link href="/stores/cyb/1" className="w-full text-black dark:text-white no-underline">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-2 bg-gray-400 p-2 rounded-xl justify-center mb-3">
                                <div className="w-full">
                                    <div className="h-[150px] bg-gray-100 justify-center items-center text-center flex rounded-xl">
                                        <svg className="w-15 h-15 text-gray-800 dark:text-white text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col ml-3">
                                    <span className="text-xl font-bold uppercase text-black dark:text-white">
                                        Success Story
                                    </span>
                                    <span className="text-sm font-light text-black dark:text-white leading-tight">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </span>

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
                            </div>
                        </div>
                    </Link>

                    
                </div>

            </div>

            <AppMenu />
        </main>
    );
}