import { useState } from "react";
import { IoClose, IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function InfoForm({ onClose, info, setInfo }) {
  const [form, setForm] = useState(info);
  const [errors, setErrors] = useState({});

  const handleSaveInfo = () => {
    if (!form.address) {
      setErrors({ address: "กรุณากรอกที่ตั้งสาขา-ที่จัดส่งของขวัญ" });
      toast.error("กรุณากรอกที่ตั้งสาขา-ที่จัดส่งของขวัญ");
      return;
    }
    if (!form.phone_manager) {
      setErrors({ phone_manager: "กรุณากรอกเบอร์ติดต่อผู้จัดสาขา" });
      toast.error("กรุณากรอกเบอร์ติดต่อผู้จัดสาขา");
      return;
    }
    if (
      !form.receiver1_empId ||
      !form.receiver1_name ||
      !form.receiver1_phone
    ) {
      setErrors({
        receiver1_empId: "กรุณากรอกข้อมูลผู้รับสินค้าให้ครบถ้วน",
        receiver1_name: "กรุณากรอกข้อมูลผู้รับสินค้าให้ครบถ้วน",
        receiver1_phone: "กรุณากรอกข้อมูลผู้รับสินค้าให้ครบถ้วน",
      });
      toast.error("กรุณากรอกข้อมูลผู้รับสินค้าให้ครบถ้วน");
      return;
    }

    toast.success("บันทึกข้อมูลสําเร็จ");
    setInfo(form);
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row items-center bg-[#0056FF] text-white p-2 gap-4">
        <IoChevronBackOutline
          className="cursor-pointer"
          onClick={onClose}
          size={25}
        />
        <h2 className="text-lg font-bold">รายละเอียดคำสั่งจอง</h2>
      </div>
      {/* Form */}
      <div className="flex flex-col text-sm gap-2 p-4">
        <div>
          <label htmlFor="address" className="font-bold">
            ที่ตั้งสาขา-ที่จัดส่งของขวัญ
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            id="address"
            value={form?.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={`w-full border rounded-lg p-2
            ${errors?.address ? "border-red-500" : "border-gray-300"}`}
            placeholder="ที่ตั้งสาขา-ที่จัดส่งของขวัญ"
            rows="3"
          />
          {errors?.address && (
            <p className="text-red-500 text-xs">{errors.address}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone_manager" className="font-bold">
            เบอร์โทรศัพท์ผู้จัดการสาขา
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone_manager"
            id="phone_manager"
            value={form?.phone_manager}
            onChange={(e) =>
              setForm({ ...form, phone_manager: e.target.value })
            }
            className={`w-full border rounded-lg p-2
            ${errors.phone_manager ? "border-red-500" : "border-gray-300"}`}
            placeholder="เบอร์โทรศัพท์ผู้จัดการสาขา"
          />
          {errors.phone_manager && (
            <p className="text-red-500 text-xs">{errors.phone_manager}</p>
          )}
        </div>
        <div>
          <label htmlFor="receiver1_empId" className="font-bold">
            รหัสผู้รับสินค้า 1 (กรอกรหัสพนักงาน)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="receiver1_empId"
            id="receiver1_empId"
            value={form?.receiver1_empId}
            onChange={(e) =>
              setForm({ ...form, receiver1_empId: e.target.value })
            }
            className={`w-full border rounded-lg p-2
            ${errors.receiver1_empId ? "border-red-500" : "border-gray-300"}`}
            placeholder="กรอกรหัสพนักงาน"
          />
          {errors.receiver1_empId && (
            <p className="text-red-500 text-xs">{errors.receiver1_empId}</p>
          )}
        </div>
        <div>
          <label htmlFor="receiver1_name" className="font-bold">
            ชื่อผู้รับสินค้า 1 (กรอกชื่อ-นามสกุล)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="receiver1_name"
            id="receiver1_name"
            value={form?.receiver1_name}
            onChange={(e) =>
              setForm({ ...form, receiver1_name: e.target.value })
            }
            className={`w-full border rounded-lg p-2
            ${errors.receiver1_name ? "border-red-500" : "border-gray-300"}`}
            placeholder="กรอกชื่อ-นามสกุล"
          />
          {errors.receiver1_name && (
            <p className="text-red-500 text-xs">{errors.receiver1_name}</p>
          )}
        </div>
        <div>
          <label htmlFor="receiver1_phone" className="font-bold">
            เบอร์โทรผู้รับสินค้า 1 (กรอกเบอร์โทรศัพท์)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="receiver1_phone"
            id="receiver1_phone"
            value={form?.receiver1_phone}
            onChange={(e) =>
              setForm({ ...form, receiver1_phone: e.target.value })
            }
            className={`w-full border rounded-lg p-2
            ${errors.receiver1_phone ? "border-red-500" : "border-gray-300"}`}
            placeholder="กรอกเบอร์โทรศัพท์"
          />
          {errors.receiver1_phone && (
            <p className="text-red-500 text-xs">{errors.receiver1_phone}</p>
          )}
        </div>
        <div>
          <label htmlFor="receiver2_empId" className="font-bold">
            รหัสผู้รับสินค้า 2 (กรอกรหัสพนักงาน)
          </label>
          <input
            type="text"
            name="receiver2_empId"
            id="receiver2_empId"
            value={form?.receiver2_empId}
            onChange={(e) =>
              setForm({ ...form, receiver2_empId: e.target.value })
            }
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            placeholder="กรอกรหัสพนักงาน"
          />
        </div>
        <div>
          <label htmlFor="receiver2_name" className="font-bold">
            ชื่อผู้รับสินค้า 2 (กรอกชื่อ-นามสกุล)
          </label>
          <input
            type="text"
            name="receiver2_name"
            id="receiver2_name"
            value={form?.receiver2_name}
            onChange={(e) =>
              setForm({ ...form, receiver2_name: e.target.value })
            }
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            placeholder="กรอกชื่อ-นามสกุล"
          />
        </div>
        <div>
          <label htmlFor="receiver1_phone" className="font-bold">
            เบอร์โทรผู้รับสินค้า 2 (กรอกเบอร์โทรศัพท์)
          </label>
          <input
            type="text"
            name="receiver2_phone"
            id="receiver2_phone"
            value={form?.receiver2_phone}
            onChange={(e) =>
              setForm({ ...form, receiver2_phone: e.target.value })
            }
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            placeholder="กรอกเบอร์โทรศัพท์"
          />
        </div>
        <div className="flex justify-center mt-2">
          <button
            className="bg-[#0056FF] text-white px-4 py-2 rounded-lg"
            onClick={handleSaveInfo}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
