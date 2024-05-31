import { AppLayout } from "@/themes";

export default function Campaign() {
    return (
        <main className="flex flex-col dark:bg-gray-900">
        
            <div className="relative p-3top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Campaign</span>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-[100vw] p-2">
                <div className="flex flex-col w-[100vw]">
                    <div className="relative w-full justify-center items-center">
                        
                    </div>
                        
                </div>
            </div>
        </main>
    );
}

Campaign.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Campaign.auth = true