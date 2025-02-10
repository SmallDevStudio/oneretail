// pages/training.js
import React from 'react';
import { AppLayout } from '@/themes';
import CustomCalendar from '@/components/Calendar';

const Training = () => {

  return (
    <div className="p-4 mb-20">
      <div className='flex justify-center items-center w-full mt-5 mb-3'>
        <h1 className="text-3xl font-bold mb-4 text-[#0056FF]">ตารางการอบรม</h1>
      </div>
      <div className="flex w-full justify-center items-center">
       <CustomCalendar />
    </div>
    </div>
  );
};

export default Training;
