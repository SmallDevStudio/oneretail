import React, { useState, useEffect, useRef } from "react";
import Avatar from "@/components/utils/Avatar";
import { CiExport } from "react-icons/ci";
import { ImFilePicture } from "react-icons/im";
import { FaRegFilePdf } from "react-icons/fa";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const ClubLeaderboardResult = ({ dataset }) => {
  const exportRef = useRef();

  if (!dataset) return null;

  const handleExport = async () => {
    if (!exportRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2, // 🔥 เพิ่มความคม
      });

      const link = document.createElement("a");
      link.download = `club-leaderboard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdfWidth = 210; // A4 width (mm)
        const pdfHeight = 297;

        const imgWidth = img.width;
        const imgHeight = img.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        pdf.addImage(dataUrl, "PNG", 0, 0, finalWidth, finalHeight);

        pdf.save("club-leaderboard.pdf");
      };
    } catch (error) {
      console.error("Export PDF error:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-end mb-2 gap-2">
        <button
          className="flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleExportPDF}
        >
          <FaRegFilePdf size={18} />
        </button>
        <button
          className="flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleExport}
        >
          <ImFilePicture size={18} />
        </button>
      </div>
      <div ref={exportRef}>
        {Object.entries(dataset).map(([region, rewards]) => (
          <div key={region} className="mb-10 border p-6 bg-white">
            {Object.entries(rewards).map(([reward, zones]) => (
              <div key={reward}>
                {/* 🔷 Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-blue-600">{region}</h1>
                  <h2 className="text-xl font-semibold text-blue-500">
                    {reward}
                  </h2>
                </div>

                {/* 🔽 Zone */}
                {Object.entries(zones).map(([zone, branches]) => (
                  <div key={zone} className="mb-6">
                    {/* เขต */}
                    <div className="border-t-2 border-black py-2 font-bold">
                      เขต: {zone}
                    </div>

                    {/* 🔽 Branch */}
                    {Object.entries(branches).map(([branch, people]) => (
                      <div key={branch} className="mb-4">
                        {/* สาขา */}
                        <div className="border-b border-gray-400 py-1 text-sm font-semibold">
                          สาขา: {branch}
                        </div>

                        {/* 🔽 People */}
                        {people.map((person, index) => (
                          <div
                            key={person.empId + index}
                            className="flex gap-4 py-4 border-b"
                          >
                            {/* รูป */}
                            <div className="flex" />
                            <Avatar
                              src={person.pictureUrl}
                              size={80}
                              userId={person.userId}
                              crossOrigin="anonymous"
                            />
                            {/* ข้อมูล */}
                            <div>
                              <div className="font-bold text-lg">
                                {person.name}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {person.position} : {person.team}
                              </div>
                              <div className="text-xl font-bold">
                                KPI {person.achieve}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubLeaderboardResult;
