"use client"
import { useState, useEffect } from "react";
import { AdminLayout } from "@/themes";
import Header from "@/components/admin/global/Header";
import { UserTable } from "@/components/admin/users/UserTable";
export default function Users() {
    return (
            <div className="flex flex-col p-5 w-full">
                <Header title="จัดการผู้ใช้" subtitle="" />
                <div className="flex mb-5">
                    
                </div>
                <div className="p-5">
                    <UserTable />
                </div>
            </div>
    );
}

Users.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;