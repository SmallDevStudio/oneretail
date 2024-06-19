// LearnSkeleton.jsx
import React from "react";

const LearnSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="flex flex-col w-full mb-20 p-2">
      {skeletonItems.map((_, index) => (
        <div key={index} className="flex flex-row bg-gray-200 mb-2 rounded-md p-2 animate-pulse">
          <div className="flex justify-center items-center max-h-[150px] min-w-[150px] bg-gray-300 rounded-lg"></div>
          <div className="flex flex-col text-left ml-2 space-y-2 w-[200px]">
            <div className="bg-gray-300 h-6 rounded-md"></div>
            <div className="bg-gray-300 h-4 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearnSkeleton;
