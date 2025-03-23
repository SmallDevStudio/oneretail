import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function MenuSection({ menu }) {
  const router = useRouter();
  const getImageSrc = (image) => {
    if (!image || typeof image !== "object") return "/dist/img/simple.png";
    if (!image.url || image.url === "") return "/dist/img/simple.png";
    return image.url;
  };

  const handleLink = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {menu &&
        menu.map((m, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-200 rounded-lg p-3 shadow-sm w-full"
          >
            {/* Menu Header */}
            <div className="flex flex-row gap-3 w-full">
              <div className="shrink-0 w-[60px] h-[60px] relative">
                <Image
                  src={getImageSrc(m.image)}
                  alt={m.title}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col w-full overflow-hidden">
                <h2 className="text-base font-bold truncate">{m.title}</h2>
                <p className="text-xs text-gray-500 break-words line-clamp-3 leading-snug">
                  {m.descriptions}
                </p>
              </div>
            </div>

            {/* SubMenu Section */}
            {m.submenu?.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                {m.submenu.map((s, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex flex-col items-center justify-center bg-gray-300 text-center border border-gray-100 rounded-lg p-2"
                    onClick={() => handleLink(s.url)}
                  >
                    <Image
                      src={getImageSrc(s.image)}
                      alt={s.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                    <h2 className="text-xs font-semibold mt-1">{s.title}</h2>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
