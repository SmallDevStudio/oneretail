import Image from "next/image";

export default function Ambassador({ fullName, branch, kpi, pictureUrl }) {
  return (
    <div
      className="relative w-full max-w-[800px] aspect-[4/3] mx-auto bg-cover bg-center"
      style={{
        backgroundImage: `url("/images/certificates/grand-ambassador.png")`,
      }}
    >
      {/* Profile Picture */}
      <Image
        src={pictureUrl || "/default-avatar.png"}
        alt="Profile"
        className="absolute top-[36%] left-[50%] translate-x-[-50%] w-[100px] h-[100px] rounded-full object-cover border-4 border-white"
      />

      {/* ชื่อ */}
      <div className="absolute bottom-[34%] left-[50%] translate-x-[-50%] text-center text-xl font-bold text-black">
        {fullName}
      </div>

      {/* สาขา */}
      <div className="absolute bottom-[27%] left-[50%] translate-x-[-50%] text-sm text-gray-700">
        BRANCH MANAGER: {branch}
      </div>

      {/* KPI */}
      <div className="absolute bottom-[20%] left-[50%] translate-x-[-50%] text-lg font-bold text-indigo-700">
        KPI {kpi}
      </div>
    </div>
  );
}
