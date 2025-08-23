import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { Breadcrumbs, Dialog, Slide, Divider } from "@mui/material";
import { FaHome } from "react-icons/fa";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FaGift } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Swal from "sweetalert2";
import InfoForm from "@/components/gift/InfoForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function GiftsDetails() {
  const [gift, setGift] = useState([]);
  const [budget, setBudget] = useState([]);
  const [selectedGift, setSelectedGift] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [inputQty, setInputQty] = useState(0); // สำหรับใส่จำนวน
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSelect, setOpenSelect] = useState(null);
  const [openGift, setOpenGift] = useState(null);
  const [showGift, setShowGift] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { branchId } = router.query;

  const { data: budgets } = useSWR(`/api/gift/budget/${branchId}`, fetcher, {
    onSuccess: (data) => {
      setBudget(data.data);
      setRemainingBudget(data.data.budget);
    },
  });

  const { data: gifts } = useSWR(`/api/gift`, fetcher, {
    onSuccess: (data) => {
      setGift(data.data);
    },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/gift/order/${branchId}`);
        const data = res.data;
        if (data.success && data.data) {
          const order = data.data;

          // แปลง order.gifts จาก Array<[]>
          const flatGifts = order.gifts.flat(); // ✅ fix รูปแบบ gift ซ้อน []

          const updatedGiftList = gift.map((g) => {
            const matched = flatGifts.find(
              (og) => og._id === g._id || og.code === g.code
            );
            return matched
              ? { ...g, qty: matched.qty, total: matched.total }
              : g;
          });

          setGift(updatedGiftList);
          setSelectedGift(flatGifts);
          setInfo(order.info ? order.info : null);
          setIsEdit(true);
          setOrderId(order._id);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsOrderLoaded(true);
      }
    };

    if (branchId && gift.length > 0 && !isOrderLoaded) {
      fetchOrder();
    }
  }, [branchId, gift, isOrderLoaded]);

  useEffect(() => {
    const total = selectedGift.reduce((acc, g) => acc + g.qty * g.price, 0);
    setTotalAmount(total);
    setRemainingBudget(budget.budget - total);
  }, [budget.budget, selectedGift]);

  const handleQtyChange = () => {
    if (!openSelect) return;

    const selected = gift.find((g) => g._id === openSelect);
    const qty = parseInt(inputQty, 10);

    if (qty === 0) {
      const newSelected = selectedGift.filter((g) => g.id !== selected.id);
      setSelectedGift(newSelected);
    } else {
      const updatedGift = {
        ...selected,
        qty,
        total: qty * selected.price,
      };

      const newSelected = [
        ...selectedGift.filter((g) => g.id !== selected.id),
        updatedGift,
      ];
      setSelectedGift(newSelected);
    }

    setOpenSelect(null);
    setInputQty(0);
  };

  const handleSaveOrder = async (status) => {
    if (!session?.user?.id) return;

    if (status === "pending" && selectedGift.length > 0) {
      const result = await Swal.fire({
        title: "ยืนยันการสั่งจอง",
        icon: "warning",
        text: "การสั่งจองจะไม่สามารถยกเลิก และแก้ไขได้ คุณแน่ใจหรือไม่",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    const giftsToSave = selectedGift.map((gift) => ({
      ...gift, // ส่ง gift ทั้ง object
    }));

    const dataToSave = {
      userId: session.user.id,
      branchId: branchId,
      gifts: giftsToSave,
      info,
      status,
    };

    try {
      if (isEdit && orderId) {
        const update_by = {
          update_by: [
            {
              userId: session.user.id,
              update_at: new Date(),
            },
          ],
        };
        dataToSave.update_by = update_by.update_by;
        // update
        await axios.put(`/api/gift/order/${branchId}`, {
          newData: dataToSave,
          orderId, // for logging if needed
        });
        toast.success("อัปเดตรายการสำเร็จ");
      } else {
        // create
        await axios.post("/api/gift/order", dataToSave);
        toast.success("บันทึกรายการสำเร็จ");
      }
      router.push("/gifts");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleOpenGift = (gift) => {
    setShowGift(gift);
    setOpenGift(gift._id || gift.id);
  };

  const handleCloseGift = () => {
    setShowGift(null);
    setOpenGift(null);
  };

  const handleOpenConfirm = () => {
    if (remainingBudget < 0) {
      Swal.fire({
        icon: "error",
        title: "งบประมาณไม่เพียงพอ",
        html: `
            <p>งบประมาณ: <b>${budget.budget.toFixed(2)}</b></p>
            <p>จำนวนเงินที่ใช้ทั้งหมด: <b>${totalAmount.toFixed(2)}</b></p>
            <p>ยอดงบคงเหลือ: <b class='text-red-500'>${remainingBudget.toFixed(
              2
            )}</b></p>
            <br/>
            <b>ระบบไม่อนุญาตให้บันทึกรายการสั่งของขวัญ</b>
          `,
      });
    } else {
      setOpenConfirm(true);
    }
  };

  const handleOpenInfo = () => {
    if (!info) {
      setOpenInfo(true);
    } else {
      handleOpenConfirm();
    }
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    handleOpenConfirm();
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="flex items-center gap-2 bg-[#0056FF] text-lg text-white p-3">
        <div className="flex flex-row items-center gap-2">
          <IoChevronBack
            className="text-lg cursor-pointer"
            onClick={() => router.back()}
          />
          <h2 className="text-lg font-bold">ระบบจองของขวัญปีใหมม่ 2567</h2>
        </div>
      </div>
      {/* Breadcrumbs */}
      <div className="flex flex-row items-center">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{
            fontFamily: "ttb",
            fontSize: "12px",
            paddingLeft: "6px",
            paddingRight: "6px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          <div
            className="flex flex-row items-center gap-1"
            onClick={() => router.push("/gifts")}
          >
            <FaHome className="text-gray-400 text-sm" />
            <span>หน้าหลัก</span>
          </div>
          <span className="text-[#0056FF] text-sm font-bold">
            ระบบจองของขวัญปีใหมม่ 2567
          </span>
        </Breadcrumbs>
      </div>

      {/* Table section (scrollable only this part) */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="flex justify-center w-full my-4">
          <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
            <h2 className="font-bold text-sm">
              รายการสั่งจองของขวัญปีใหม่ 2567
            </h2>
          </div>
        </div>

        <div className="border rounded-md">
          <table className="min-w-full text-xs border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 w-12">No</th>
                <th className="px-4 py-2">รายการของขวัญ</th>
              </tr>
            </thead>
            <tbody>
              {gift?.map((item, index) => (
                <tr key={item._id}>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex flex-col items-center justify-start gap-2">
                      {index + 1}
                      <FaGift
                        className="text-[#F2871F] cursor-pointer"
                        onClick={() => handleOpenGift(item)}
                      />
                    </div>
                  </td>
                  <td className="border px-2 py-2">
                    <div className="flex flex-col justify-start gap-1">
                      <span
                        className="text-[#0056FF] font-bold text-sm cursor-pointer"
                        onClick={() => handleOpenGift(item)}
                      >
                        {item.name}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-gray-500">เลือกจำนวน:</span>
                          {(() => {
                            const selected = selectedGift.find(
                              (g) => g._id === item._id
                            );
                            return (
                              <div
                                onClick={() => {
                                  setOpenSelect(item._id);
                                  setInputQty(selected?.qty || 0);
                                }}
                                className="flex items-center gap-2 border rounded-md px-2 py-1 cursor-pointer"
                              >
                                {selected?.qty ? (
                                  `${selected.qty} ชิ้น`
                                ) : (
                                  <span className="text-[11px]">
                                    รอการสั่งซื้อ
                                  </span>
                                )}
                                <IoIosArrowDown className="text-gray-500" />
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <span className="text-gray-500">ราคาต่อชิ้น:</span>
                          <div className="border rounded-md px-2 py-1">
                            {formatNumber(item.price)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            จำนวนเงินที่ใช้:
                          </span>
                          <div className="border rounded-md px-2 py-1">
                            {selectedGift
                              .find((g) => g._id === item._id)
                              ?.total?.toLocaleString("th-Th", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "0.00"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer (fixed at bottom) */}
      <div className="sticky bottom-16 bg-gray-300 px-2 py-2 w-full shadow-lg">
        <div className="flex justify-between items-center px-4 py-2 w-full">
          <div className="flex flex-col items-center w-1/3">
            <span className="text-sm font-bold">งบประมาณที่ได้รับ</span>
            <div className="border rounded-md px-2 py-1 text-center bg-blue-950 text-white font-bold w-full">
              {formatNumber(budget?.budget)}
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <span className="text-sm font-bold">จำนวนเงินที่ใช้</span>
            <div className="border rounded-md px-2 py-1 text-center bg-blue-500 text-white font-bold w-full">
              {formatNumber(totalAmount)}
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <span className="text-sm font-bold">ยอดงบคงเหลือ</span>
            <div
              className={`border rounded-md px-2 py-1 text-center font-bold w-full ${
                remainingBudget < 0 ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {formatNumber(remainingBudget)}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 px-4 py-2 w-full">
          <button
            className="bg-[#F2871F] text-white font-bold px-4 py-2 rounded-lg"
            onClick={() => handleOpenInfo()}
          >
            บันทึก
          </button>
          <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg">
            ยกเลิก
          </button>
        </div>
      </div>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        TransitionComponent={Transition}
      >
        <div className="flex flex-col gap-2 p-4 w-full">
          <div className="absolute top-2 right-2">
            <IoClose
              className="text-red-500 text-lg cursor-pointer"
              onClick={() => setOpenConfirm(false)}
            />
          </div>
          <h2 className="text-lg font-bold text-center">
            ยืนยันการสั่งซื้อของขวัญ
          </h2>
          <p className="text-sm text-center">
            คุณต้องการยืนยันการสั่งซื้อของขวัญหรือไม่?
          </p>
          <div>
            <table className="table-auto w-full text-xs">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-1">รายการ</th>
                  <th className="py-1">จํานวน</th>
                  <th className="py-1">ราคา</th>
                </tr>
              </thead>
              <tbody>
                {selectedGift.map((item) => (
                  <tr key={item._id}>
                    <td className="py-1">{item.name}</td>
                    <td className="py-1">{item.price}</td>
                    <td className="py-1">{item.total}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1">รวมทั้งหมด</td>
                  <td
                    className="bg-green-500 font-bold text-white py-1"
                    colspan="2"
                  >
                    {totalAmount?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">งบประมาณที่ได้รับ</td>
                  <td
                    className="bg-orange-500 font-bold text-white py-1"
                    colspan="2"
                  >
                    {budget?.budget?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">งบประมาณคงเหลือ</td>
                  <td
                    className="bg-blue-500 font-bold text-white py-1"
                    colspan="2"
                  >
                    {remainingBudget?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-red-500 text-center">
            หากยืนยันการสั่งซื้อของขวัญ จะไม่สามารถแก้ไขได้
          </p>

          <div className="flex justify-center gap-2">
            <button
              className="bg-[#F2871F] text-white font-bold px-4 py-2 rounded-lg"
              onClick={() => handleSaveOrder("draft")}
            >
              ยืนยันแบบร่าง
            </button>
            <button
              className="bg-[#0056FF] text-white font-bold px-4 py-2 rounded-lg"
              onClick={() => handleSaveOrder("pending")}
            >
              ยืนยันบันทึก
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openSelect}
        onClose={() => setOpenSelect(null)}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "none",
          },
        }}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row bg-[#0056FF] text-white items-center justify-between px-4 py-2">
            <h2 className="text-lg font-bold ">เลือกของขวัญ</h2>
            <div className="bg-white p-1 rounded-full">
              <IoClose
                className="text-red-500 text-sm cursor-pointer"
                onClick={() => setOpenSelect(null)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 px-4 py-2">
            <span className="text-sm font-bold">จํานวน:</span>
            <div className="relative">
              <input
                type="number"
                className="border rounded-md px-2 py-1 pr-8 w-full"
                placeholder="จำนวนของขวัญ"
                value={inputQty}
                onChange={(e) => setInputQty(e.target.value)}
              />
              {inputQty > 0 && (
                <IoClose
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer"
                  onClick={() => setInputQty(0)}
                />
              )}
            </div>
            <button
              className="bg-[#F2871F] text-white font-bold px-4 py-1 rounded-lg"
              onClick={handleQtyChange}
            >
              บันทึก
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openGift}
        onClose={handleCloseGift}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "none",
          },
        }}
      >
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex flex-row bg-[#0056FF] text-white items-center justify-between px-4 py-2">
            <h2 className="text-lg font-bold ">{showGift?.name}</h2>
            <div className="bg-white p-1 rounded-full">
              <IoClose
                className="text-red-500 text-sm cursor-pointer"
                onClick={handleCloseGift}
              />
            </div>
          </div>
          {/* Content */}
          <div className="flex flex-col items-center gap-4 px-4 py-2">
            <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
              <h2 className="font-bold">รายละเอียดของขวัญปีใหม่</h2>
            </div>
            <div>
              <Image
                src={showGift?.image?.url || "/images/gift/gift-bag.png"}
                width={150}
                height={150}
                alt="gift-bag"
                className={`object-contain w-full h-full`}
              />
            </div>
            <h3 className="text-sm font-bold">{showGift?.name}</h3>
            {showGift?.description && (
              <p
                className="text-sm text-gray-600"
                style={{ whiteSpace: "pre-line" }}
              >
                {showGift?.description}
              </p>
            )}
            <div className="flex flex-row items-center text-sm gap-2">
              <span>ราคาขายต่อชิ้น</span>{" "}
              <span className="font-bold">{showGift?.price}</span>{" "}
              <span>บาท</span>
            </div>

            <div>
              <div
                className="flex text-sm px-4 py-2 bg-[#0056FF]/30 border border-[#0056FF]/60 rounded-lg"
                onClick={handleCloseGift}
              >
                ปิดหน้าต่างนี้
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openInfo}
        onClose={handleCloseInfo}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: "none",
          },
        }}
      >
        <InfoForm onClose={handleCloseInfo} info={info} setInfo={setInfo} />
      </Dialog>
    </div>
  );
}
