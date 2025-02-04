import { useState, useEffect } from "react";
import axios from "axios";

export default function EmpForm({ empData, mutate }) {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const handleEmpId = async (empId) => {
        if (empId === "") setErrors({ empId: "กรุณากรอกรหัสพนักงาน" });
        if (empId.length < 5) setErrors({ empId: "กรุณากรอกรหัสพนักงานให้ครบ 5 ตัว" });
        if (empId.match(/[^0-9]/)) setErrors({ empId: "กรุณากรอกรหัสพนักงานเป็นตัวเลขเท่านั้น" });
        if (empId.length === 5) {
            const res = await axios.get(`/api/emp/${empId}`);
            console.log(res.data.data);
            if (res.data.data) {
                setErrors({empId: "รหัสพนักงานนี้มีอยู่ในระบบแล้ว"});
            }
        }
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
                        onChange={(e) => handleEmpId(e.target.value)} 
                    />
                </div>
                {errors.empId && <span className="text-sm text-red-500 self-end">{errors.empId}</span>}
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">TeamGroup:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.teamGrop ? "border-red-500" : ""}`} 
                        name="teamGrop"
                        maxLength={5}
                        placeholder="teamGrop"
                        value={form.teamGrop} 
                        onChange={(e) => setForm({...form, teamGrop: e.target.value})} 
                    />
                </div>
                {errors.teamGrop && <span className="text-sm text-red-500 self-end">{errors.teamGrop}</span>}
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Sex:</span>
                    <select 
                        name="sex" 
                        id="sex"
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.sex ? "border-red-500" : ""}`}
                    >
                        <option value="">กรุณาเลือกเพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                    </select>
                </div>
                {errors.sex && <span className="text-sm text-red-500 self-end">{errors.sex}</span>}
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Name:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.name ? "border-red-500" : ""}`} 
                        name="name"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.name} 
                        onChange={(e) => setForm({...form, name: e.target.value})} 
                    />
                </div>
                {errors.name && <span className="text-sm text-red-500 self-end">{errors.name}</span>}
            </div>


            

        </div>
    );
}