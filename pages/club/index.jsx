import AppLayout from "@/themes/Layout/AppLayout";
import Image from "next/image";

export default function Club() {
    return (
        <div className="flex flex-col w-[100%] h-[100vh] bg-[#120d0f]">
            <Image
                src="/images/club.png"
                alt="one Retail Logo"
                width={300}
                height={500}
                priority
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center justify-center"
            />
        </div>
    );
}

Club.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Club.auth = true;