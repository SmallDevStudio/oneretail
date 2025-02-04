import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";

export default function EmpForm({ empData, mutate, handleClose }) {
    // ตั้งค่าข้อมูลเริ่มต้นของฟอร์ม
    const initialFormState = {
        empId: "",
        teamGrop: "",
        sex: "",
        name: "",
        position: "",
        chief_th: "",
        chief_eng: "",
        group: "",
        department: "",
        branch: ""
    };

    const [form, setForm] = useState({ ...initialFormState });
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (empData) {
            setIsEdit(true);
            setForm({...empData});
        } else {
            setIsEdit(false);
            setForm({ ...initialFormState });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empData]);

    const handleEmpId = async (e) => {
        let empId = e.target.value;
    
        // กรองเฉพาะตัวเลขเท่านั้น
        empId = empId.replace(/\D/g, "");
    
        // จำกัดความยาวไม่เกิน 5 ตัว
        if (empId.length > 5) {
            empId = empId.slice(0, 5);
        }
    
        // อัปเดตค่าในฟอร์ม
        setForm({ ...form, empId });
    
        // ตรวจสอบข้อผิดพลาด
        if (empId.length === 0) {
            return setErrors({ empId: "กรุณากรอกรหัสพนักงาน" });
        }
        if (empId.length < 5) {
            return setErrors({ empId: "กรุณากรอกรหัสพนักงานให้ครบ 5 ตัว" });
        }
    
        // เมื่อกรอกครบ 5 ตัว ตรวจสอบว่ามี empId นี้แล้วหรือไม่
        if (empId.length === 5) {
            try {
                const res = await axios.get(`/api/emp/${empId}`);
                if (res.data.data) {
                    return setErrors({ empId: "รหัสพนักงานนี้มีอยู่ในระบบแล้ว" });
                }
            } catch (error) {
                console.error("Error checking empId:", error);
            }
        }
    
        // ถ้าไม่มีข้อผิดพลาด ให้ล้าง errors
        setErrors({});
    };

    const handleTeamGrop = async (teamGrop) => {
        if (teamGrop === "") setErrors({ teamGrop: "กรุณากรอก teamGrop" });
        setErrors({});
        setForm({ ...form, teamGrop: teamGrop });
    };

    const handleClear = () => {
        setForm({...initialFormState}); 
        setErrors({}); 
        setTimeout(() => {
            handleClose();
        }, 100);
    };

    const handleSave = async () => {
        if (!form.empId) return setErrors({empId: "กรุณากรอกรหัสพนักงาน"});
        if (!form.teamGrop) return setErrors({teamGrop: "กรุณากรอก teamGrop"});
        if (form.empId.length < 5) return setErrors({empId: "กรุณากรอกรหัสพนักงานให้ครบ 5 ตัว"});
        if (form.empId.match(/[^0-9]/)) return setErrors({empId: "กรุณากรอกรหัสพนักงานเป็นตัวเลขเท่านั้น"});

        try {
            if (isEdit) {
                await axios.put(`/api/emp/${form.empId}`, form);
                mutate();
            } else {
                await axios.post(`/api/emp`, form);
                mutate();
            }
            mutate();
            handleClear();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col w-full gap-2 p-2">
            <span className="text-xl font-bold text-[#0056FF]">
                {isEdit ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มข้อมูลพนักงาน"}
            </span>

            <Divider className="my-2"/>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">EmpId:<span className="text-sm font-bold text-red-500">*</span></span>
                    <input
                        type="text"
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.empId ? "border-red-500" : ""}`} 
                        name="empId"
                        maxLength={5}
                        placeholder="กรอกรหัสพนักงาน"
                        value={form.empId} 
                        onChange={handleEmpId} 
                        onBlur={handleEmpId} // เช็คซ้ำเมื่อออกจาก input
                    />
                </div>
                {errors.empId && <span className="text-sm text-red-500 self-end">{errors.empId}</span>}
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">TeamGroup:<span className="text-sm font-bold text-red-500">*</span></span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.teamGrop ? "border-red-500" : ""}`} 
                        name="teamGrop"
                        maxLength={5}
                        placeholder="teamGrop"
                        value={form.teamGrop} 
                        onChange={(e) => handleTeamGrop(e.target.value)} 
                        required
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
                        value={form?.sex} 
                        onChange={(e) => setForm({...form, sex: e.target.value})}
                    >
                        <option value="">กรุณาเลือกเพศ</option>
                        <option value="M">ชาย</option>
                        <option value="F">หญิง</option>
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
                
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Position:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.position ? "border-red-500" : ""}`} 
                        name="position"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.position} 
                        onChange={(e) => setForm({...form, position: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Chief_th:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.chief_th ? "border-red-500" : ""}`} 
                        name="chief_th"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.chief_th} 
                        onChange={(e) => setForm({...form, chief_th: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Chief_eng:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.chief_eng ? "border-red-500" : ""}`} 
                        name="chief_eng"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.chief_eng} 
                        onChange={(e) => setForm({...form, chief_eng: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Group:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.group ? "border-red-500" : ""}`} 
                        name="group"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.group} 
                        onChange={(e) => setForm({...form, group: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">Department:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.department ? "border-red-500" : ""}`} 
                        name="department"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.department} 
                        onChange={(e) => setForm({...form, department: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-2">
                    <span className="text-sm font-bold">branch:</span>
                    <input 
                        type="text" 
                        className={`border-2 rounded-lg px-2 py-1 w-full ${errors.branch ? "border-red-500" : ""}`} 
                        name="department"
                        maxLength={5}
                        placeholder="กรอกชื่อพนักงาน"
                        value={form.branch} 
                        onChange={(e) => setForm({...form, branch: e.target.value})} 
                    />
                </div>
            </div>

            <div className="flex flex-row justify-center items-center w-full mt-4">
                <button
                    className="bg-[#0056FF] text-white px-4 py-2 rounded-lg"
                    onClick={() => handleSave}
                >
                    {isEdit ? "แก้ไข" : "บันทึก"}
                </button>

                <button
                    className="bg-[#ED1C24] text-white px-4 py-2 rounded-lg ml-2"
                    onClick={handleClear}
                >
                    ยกเลิก
                </button>
            </div>
        </div>
    );
}