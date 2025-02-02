import React from "react";
import { Skeleton, Stack } from "@mui/material";

const FeedSkeleton = () => {

  return (
    <div className="flex flex-col w-full mb-20 p-2">
        <Stack spacing={2} direction={"column"}>
          <div className="flex flex-row items-center bg-gray-200 mb-2 rounded-md p-2 gap-2 animate-pulse">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={200} height={40} />
          </div>
          <Stack spacing={2} direction={"column"}>
            {[...Array(5)].map((_, index) => (
              <div 
              key={index} className="flex flex-col bg-gray-200 mb-2 rounded-md p-2 gap-2 animate-pulse">
              <div className="flex flex-row bg-gray-200 mb-2 rounded-md p-2 animate-pulse">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex flex-col text-left ml-2 space-y-2 w-[200px]">
                  <Skeleton variant="text" width={200} height={20} />
                  <Skeleton variant="text" width={20} height={10} />
                </div>
              </div> 
  
              <div className="flex flex-col bg-gray-200 mb-2 rounded-md p-2 gap-2 animate-pulse">
                <Skeleton variant="rectangular" height={200} />
              </div>
  
              <div className="flex flex-row justify-between mb-2 rounded-md px-2 py-2 animate-pulse">
                <div className="flex flex-row gap-2">
                  <Skeleton variant="circular" width={20} />
                  <Skeleton variant="text" width={50} />
                </div>
                <div className="flex flex-row gap-2">
                  <Skeleton variant="circular" width={20}/>
                  <Skeleton variant="text" width={50}/>
                </div>
                <div className="flex flex-row gap-2">
                  <Skeleton variant="circular" width={20}/>
                  <Skeleton variant="text" width={50}/>
                </div>
              </div>
            </div>
            ))}
          </Stack>
        </Stack>
    </div>
  );
};

export default FeedSkeleton;
