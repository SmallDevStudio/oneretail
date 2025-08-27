import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import OrderSection from "@/components/gift/OrderSection";
import ApproveSection from "@/components/gift/ApproveSection";
import { MdDisplaySettings } from "react-icons/md";
import Loading from "@/components/Loading";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function GiftsPage() {
  const [user, setUser] = useState(null);
  const [branch, setBranch] = useState(null);
  const [activeTab, setActiveTab] = useState("order");
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading" || !session) return;
  }, [session, status]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/gift/budget/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      onSuccess: (data) => {
        setBranch(data.data);
      },
    }
  );

  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useSWR(`/api/users/${userId}`, fetcher, {
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  const handleActive = (tabs) => {
    setActiveTab(tabs);
  };

  if (!branch || !user || isLoading) return <Loading />;

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-[#0056FF] text-lg text-white p-3">
        <div className="flex flex-row items-center gap-2">
          <IoChevronBack />
          <span className="font-bold">ระบบของขวัญปีใหม่</span>
        </div>
        {user && user?.role === "admin" && (
          <MdDisplaySettings onClick={() => router.push("/gifts/summery")} />
        )}
      </div>

      <div className="flex flex-col items-center p-4 gap-4">
        <div className="flex bg-gray-400 rounded-full items-center justify-center text-white px-4 py-1 w-2/3">
          <h2 className="font-bold">ระบบของขวัญปีใหม่ 2567</h2>
        </div>

        <div className="flex flex-col bg-gray-100 rounded-xl p-4 w-full">
          {/* menu */}
          <div className="flex flex-row items-center justify-between text-center w-full gap-8">
            <div
              className={`flex flex-col items-center justify-center text-center p-2 gap-2
                ${
                  activeTab === "order"
                    ? "bg-[#F2871F]/30 text-[#0056FF] font-bold border border-[#F2871F] rounded-xl"
                    : ""
                }
                `}
              onClick={() => handleActive("order")}
            >
              <Image
                src="/images/gift/gift-bag.png"
                width={50}
                height={50}
                alt="gift-bag"
                className={`object-contain ${
                  activeTab === "order" ? "" : "grayscale"
                }
                  `}
              />
              <span className="leading-4 text-sm">สาขาสั่งจองของขวัญ</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center text-center p-2 gap-2
                ${
                  activeTab === "approve"
                    ? "bg-[#F2871F]/30 text-[#0056FF] font-bold border border-[#F2871F] rounded-xl"
                    : ""
                }
                `}
              onClick={() => handleActive("approve")}
            >
              <Image
                src="/images/gift/shopping-cart.png"
                width={50}
                height={50}
                alt="shopping-cart"
                className={`object-contain ${
                  activeTab === "approve" ? "" : "grayscale"
                }
                  `}
              />
              <span className="leading-4 text-sm">โซนอนุมมัติการสั่งจอง</span>
            </div>
          </div>
        </div>
        {/* active */}
        <div className="flex items-center justify-center w-full">
          {activeTab === "approve" && (
            <ApproveSection active={activeTab === "approve"} user={user} />
          )}
          {activeTab === "order" && (
            <OrderSection
              active={activeTab === "order"}
              user={user}
              branch={branch}
              mutate={mutate}
              userMutate={userMutate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
