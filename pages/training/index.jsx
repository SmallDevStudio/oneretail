import React from 'react';
import AppLayout from '@/themes/Layout/AppLayout';
import Calendar from '@/components/Calendar';
export default function Training() {
    return (
        <>
        <main className="flex flex-col w-[100vw]">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mt-20">
                    ตารางการอบรม
                </h1>
            
                <div className="mt-5">
                    <Calendar />
                </div>
            </div>
        </main>
            
        </>
    );
}

Training.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

Training.auth = true