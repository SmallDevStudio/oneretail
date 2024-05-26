import AppMenu from "@/components/menu/AppMenu";
import Link from "next/link";
export default function Stores() {

    return (
        <main className="flex flex-col w-[100vw] h-[100vh] bg-gray-100 dark:bg-gray-900">
        
            <div className="relative p-3 bg-gray-200 top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[60px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Success</span>
                    <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">
                        Story
                    </span>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2">
                <div className="flex flex-col">
                    <div>
                        <Link href="/stores/cyb" className="w-full text-black dark:text-white no-underline">
                            <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                                    CYB
                            </button>
                        </Link>
                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>

                        <button className="flex flex-col items-center justify-center text-3xl font-black text-[#0056FF] p-2 mb-4 w-[350px] h-[80px] bg-[#D9D9D9] border-2 border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600">
                            Lorem ipsum
                        </button>
                    </div>
                </div>
            </div>
            <AppMenu />
        </main>
    )
}