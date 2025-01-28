import React from 'react';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th'); // ตั้งค่าภาษาเป็นไทย

const Time = ({ timestamp }) => {
  const time = moment(timestamp);

  // ตรวจสอบว่าเวลาเกิน 2 วันหรือไม่
  const isMoreThanTwoDays = moment().diff(time, 'days') > 2;

  // กำหนดรูปแบบเวลา
  const formattedTime = isMoreThanTwoDays ? time.format('lll') : time.fromNow();

  return <span>{formattedTime}</span>;
};

export default Time;
