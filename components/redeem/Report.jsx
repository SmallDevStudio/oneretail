import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import 'moment/locale/th';
import * as XLSX from 'xlsx';

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function Report() {
    const { data: session } = useSession();
    
    return (
        <div>
            Report
        </div>
    );
};


