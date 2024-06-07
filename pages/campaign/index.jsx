import { AppLayout } from "@/themes";
import Image from "next/image";

export default function Campaign() {
    return (
        <main className="flex flex-col dark:bg-gray-900">
        
            <div className="relative p-3top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white">Campaign</span>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center max-w-[100vw] p-2">
                <div className="flex flex-col w-full">
                    <div className="relative flex-col w-full justify-center items-center">
                        <Image
                            src="/images/campaign/1.jpg"
                            alt="Campaign"
                            width={600}
                            height={600}
                            priority
                            className="w-full rounded-2xl mb-2"
                        />
                        <Image
                            src="/images/campaign/2.jpg"
                            alt="Campaign"
                            width={600}
                            height={600}
                            priority
                            className="w-full rounded-2xl mb-2"
                        />
                        <Image
                            src="/images/campaign/3.jpg"
                            alt="Campaign"
                            width={600}
                            height={600}
                            priority
                            className="w-full rounded-2xl mb-2"
                        />
                        <Image
                            src="/images/campaign/4.jpg"
                            alt="Campaign"
                            width={600}
                            height={600}
                            priority
                            className="w-full rounded-2xl mb-2"
                        />
                    </div>
                        
                </div>
            </div>
        </main>
    );
}

Campaign.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Campaign.auth = true