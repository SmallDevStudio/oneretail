import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import PostPanel from "@/components/costomer-leader/PostPanel";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { GrUserSettings } from "react-icons/gr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CostomerLeaderPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // เก็บโพสต์ที่กรองแล้ว
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const { data: permissionUser, isLoading: permissionLoading } = useSWR(
    `/api/costomer-leader/permission?userId=${userId}`,
    fetcher
  );

  useEffect(() => {
    if (!permissionUser) return;

    if (permissionUser.hasUser === false) {
      router.push("/errors/403");
    }
  }, [permissionUser, router]);

  const folder = "costomer-leader";

  const {
    data,
    error,
    mutate,
    isLoading: postLoading,
  } = useSWR("/api/posts/costomer", fetcher, {
    onSuccess: (data) => {
      setPosts(data.data);
    },
  });

  const {
    data: user,
    mutate: mutateUser,
    isLoading: userLoading,
  } = useSWR(`/api/users/${session?.user?.id}`, fetcher);

  useEffect(() => {
    if (query.trim() !== "") {
      const result = posts.filter(
        (post) =>
          post.user.fullname.toLowerCase().includes(query.toLowerCase()) ||
          post.post.toLowerCase().includes(query.toLowerCase()) ||
          post.user.empId.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(result);
    } else {
      setFilteredPosts(posts); // แสดงโพสต์ทั้งหมดเมื่อ query ว่างเปล่า
    }
  }, [query, posts]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // อัปเดต query เมื่อผู้ใช้พิมพ์ในช่องค้นหา
  };

  if (postLoading || userLoading || permissionLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
      {/* Header */}
      <div>
        <div className="flex flex-row justify-between py-2 px-4w-full">
          <IoIosArrowBack className="text-2xl" onClick={() => router.back()} />
          <div className="flex flex-row items-center gap-2">
            {showSearch && (
              <input
                type="text"
                placeholder="ชื่อผู้ใช้ หรือโพสต์ หรือรหัสพนักงาน"
                className="border border-gray-300 rounded-full px-2 py-0.5 text-sm w-full mr-2"
                value={query}
                onChange={handleSearchChange}
              />
            )}
            <IoSearch
              className="text-2xl"
              onClick={() => setShowSearch(!showSearch)}
            />
            {(user.user.role === "admin" || user.user.role === "manager") && (
              <GrUserSettings
                className="text-2xl"
                onClick={() => router.push("/costomer-leader/admin")}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mt-[-10px] mb-5">
          <Image
            src="/images/LOGO-CUSTOMER-FINANCIAL-SOLUTION-LEADER.png"
            alt="LOGO-CUSTOMER-FINANCIAL-SOLUTION-LEADER-Logo"
            width={200}
            height={200}
            className="object-contain"
            style={{ width: "150px", height: "auto" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-auto bg-gray-300 max-w-full">
        <PostPanel user={user} posts={filteredPosts} mutate={mutate} />
      </div>
    </div>
  );
}
