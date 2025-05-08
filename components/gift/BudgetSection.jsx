import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";

export default function BudgetSection() {
  const [budget, setBudget] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
        <h2 className="font-bold">โซนอนุมมัติงบประมาณ</h2>
      </div>
    </div>
  );
}
