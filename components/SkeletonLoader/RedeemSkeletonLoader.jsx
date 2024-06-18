import React from 'react';

const RedeemSkeletonLoader = () => {
  return (
    <div className="flex flex-row w-full bg-gray-200 rounded-xl p-1 animate-pulse">
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="bg-gray-300 h-32 w-32 rounded"></div>
        <div className="bg-gray-300 h-6 w-16 mt-2 rounded"></div>
      </div>
      <div className="flex flex-col justify-between flex-grow p-2">
        <div>
          <div className="bg-gray-300 h-6 w-24 mb-2 rounded"></div>
          <div className="bg-gray-300 h-4 w-full mb-1 rounded"></div>
          <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex-col text-left">
            <div className="bg-gray-300 h-4 w-12 rounded"></div>
            <div className="bg-gray-300 h-6 w-16 mt-1 rounded"></div>
          </div>
          <div className="bg-gray-300 h-8 w-24 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RedeemSkeletonLoader;
