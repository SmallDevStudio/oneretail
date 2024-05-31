import React from "react";
import moment from "moment";
import 'moment/locale/th';

moment.locale('th');

const TimeDisplay = ({ time }) => {
    const timeFromNow = moment(time).fromNow();

    return <span>{timeFromNow}</span>
};

export default TimeDisplay;