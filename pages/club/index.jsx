import AppLayout from "@/themes/Layout/AppLayout";

export default function Club() {
    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center ">
                <h1 className="text-3xl font-bold">
                    Coming Soon
                </h1>
            </div>
        </>
    );
}

Club.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Club.auth = true;