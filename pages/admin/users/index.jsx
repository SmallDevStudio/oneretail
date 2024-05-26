"use client"
import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { UserTable } from "@/components/admin/users/UserTable";
import { Suspense } from "react";
import Loading from "@/components/Loading";
export default function Users() {

    return (
            <div className="flex flex-col p-10 w-full">
                <Header title="จัดการผู้ใช้" subtitle="จัดการข้อมูลผู้ใช้ ลบผู้ใช้ แก้ไขผู้ใช้ "/>
                <div className="flex mb-5">
                    
                </div>
                <div className="p-5">
                    <Suspense fallback={<Loading />}>
                        <UserTable />
                    </Suspense>
                </div>
            </div>
    );
}

Users.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;