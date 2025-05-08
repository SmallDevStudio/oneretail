import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GiftAdmin from "@/components/gift/GiftAdmin";
import BudgetAdmin from "@/components/gift/BudgetAdmin";

export default function GiftsAdmin() {
  const [activeTabs, setActiveTabs] = useState("gifts");

  const router = useRouter();

  useEffect(() => {
    const { tab } = router.query;
    if (tab) {
      setActiveTabs(tab);
    }
  }, [router.query]);

  const handleTabClick = (tab) => {
    setActiveTabs(tab);
    window.history.pushState(null, "", `?tab=${tab}`);
  };

  return (
    <div className="flex flex-col w-full p-4">
      {/* tabs */}
      <div className="flex items-center justify-center">
        <ul className="flex flex-wrap gap-4">
          <li
            className={`px-6 py-2 rounded-t-xl cursor-pointer ${
              activeTabs === "gifts" ? "bg-[#0056FF]/50" : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("gifts")}
          >
            จัดการของขวัญ
          </li>
          <li
            className={`px-6 py-2 rounded-t-xl cursor-pointer ${
              activeTabs === "budgets" ? "bg-[#0056FF]/50" : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("budgets")}
          >
            จัดการงบประมาณ
          </li>
        </ul>
      </div>

      <div className="border border-gray-300 p-4 rounded-xl min-h-[500px] shadow-md">
        {activeTabs === "gifts" && <GiftAdmin />}
        {activeTabs === "budgets" && <BudgetAdmin />}
      </div>
    </div>
  );
}
