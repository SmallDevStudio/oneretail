import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "@/components/utils/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

export default function TeamRank() {
  return (
    <>
      {/* Group */}
      <div className="bg-[#0056FF] px-2 py-4 rounded-b-xl text-white">
        <div className="flex justify-around items-end w-full">
          {(group.length > 0
            ? [...group].sort((a, b) => {
                const getNumber = (name) =>
                  parseInt(name.replace("RH", "")) || 0;
                return getNumber(a.name) - getNumber(b.name);
              })
            : top3
          ).map((item, idx) => {
            const user = group.length > 0 ? item.users[0] : item;
            const isCenter = !group.length && user.rank === 1;

            return (
              <div
                key={item.name || user.userId}
                className={`flex flex-col items-center justify-end transition-transform duration-300 ${
                  isCenter ? "scale-110" : "scale-100"
                } w-24`}
              >
                {/* อันดับหรือชื่อกลุ่ม */}
                <span className="text-sm font-bold mb-2 whitespace-nowrap">
                  {group.length > 0 ? item.name : `อันดับ ${user.rank}`}
                </span>

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                  <Avatar
                    src={user.pictureUrl}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                    userId={user.userId}
                    key={user.userId}
                  />
                </div>

                {/* Fullname: 2 lines fixed */}
                <span
                  className="text-[13px] font-semibold text-center leading-tight text-white mb-1 overflow-hidden text-ellipsis"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "2.6em",
                  }}
                >
                  {user.fullname}
                </span>

                {/* Total Points */}
                <span className="font-bold text-lg">{user.totalPoints}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-4">
        {isFetching ? (
          <CircularProgress />
        ) : (
          <>
            {/* current user card */}
            {currentUser && (
              <div className="flex flex-row items-center justify-between px-4 py-2 border rounded-full bg-[#0056FF] mb-2 shadow">
                <div className="flex flex-row items-center space-x-4">
                  <span className="text-sm font-bold text-white">
                    {currentUser.rank}
                  </span>
                  <Avatar
                    src={currentUser.pictureUrl}
                    size={40}
                    userId={currentUser.userId}
                  />
                  <span className="text-sm font-semibold text-white">
                    {currentUser.fullname}
                  </span>
                </div>
                <span className="text-sm font-bold bg-[#F68B1F] text-white px-2 py-1 rounded-full">
                  {currentUser.totalPoints}
                </span>
              </div>
            )}

            {/* user card */}
            <div className="flex flex-col w-full px-2 py-2 gap-2">
              {leaderboard
                .filter((l) => (group.length === 0 ? l.rank > 3 : true))
                .map((l, lindex) => (
                  <div
                    key={lindex}
                    className="flex flex-row items-center justify-between px-2 py-1 border rounded-full bg-gray-100"
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <span className="text-sm font-bold text-[#0056FF]">
                        {l.rank}
                      </span>
                      <Avatar
                        src={l.pictureUrl}
                        size={40}
                        userId={l.userId}
                        key={l.userId}
                      />
                    </div>
                    <span className="text-sm text-[#0056FF] font-bold">
                      {l.fullname}
                    </span>
                    <span className="text-sm font-bold bg-[#0056FF] text-white px-2 py-1 rounded-full">
                      {l.totalPoints}
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
