import { useState, useEffect } from "react";
import axios from "axios";

export default function EmpForm({ empData, mutate }) {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const handleEmpId = (empId, count) => {
        if (empId === "") setErrors({ empId: "กรุณากรอกรหัสพนักงาน" });
        if (count < 5) setErrors({ empId: "กรุณากรอกรหัสพนักงานให้ครบ 5 ตัว" });
        if (empId.match(/[^0-9]/)) setErrors({ empId: "กรุณากรอกรหัสพนักงานเป็นตัวเลขเท่านั้น" });
    }

    return (
        <div className="flex flex-col w-full gap-2 p-2">

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">EmpId:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.empId ? "border-red-500" : ""}`} 
                        name="empId"
                        maxLength={5}
                        placeholder="กรอกรหัสพนักงาน"
                        value={form.empId} 
                        onChange={(e) => handleEmpId(e.target.value, e.target.value.length)} 
                    />
                </div>
                {errors.empId && <span className="text-sm text-red-500 self-end">{errors.empId}</span>}
            </div>

        </div>
    );
}