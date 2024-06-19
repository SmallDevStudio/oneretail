// SuccessSkeleton.js
import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const SuccessSkeleton = () => {
    return (
        <div className="flex flex-col w-full mb-20 p-2">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-row bg-gray-200 mb-2 rounded-md p-2">
                    <div className="flex justify-center items-center max-h-[150px] min-w-[150px]">
                        <Skeleton variant="rectangular" width={150} height={150} />
                    </div>
                    <div className="flex flex-col text-left ml-2">
                        <div className="flex flex-col max-w-[200px] w-[200px]">
                            <Skeleton variant="text" width="100%" height={30} />
                            <Skeleton variant="text" width="100%" height={20} />
                        </div>
                        <div className="flex flex-row justify-between items-center mt-auto pt-2">
                            <Skeleton variant="text" width="60px" height={20} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuccessSkeleton;
