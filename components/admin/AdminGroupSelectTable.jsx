import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Image from 'next/image';
import moment from 'moment';

moment.locale('th');

const AdminGroupSelectTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/adminGroupSelect');
        const dataWithIds = response.data.data.map((item, index) => ({
          ...item,
          id: item._id,
        }));
        setRows(dataWithIds);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const columns = [
    { 
      field: 'adminPicture', 
      headerName: 'Avartar', 
      width: 200,
      renderCell: (params) => (
        <Image src={params.value} alt="Admin" width={50} height={50} style={{ borderRadius: '50%' }} />
      ),
    },
    { field: 'adminName', headerName: 'Name', width: 200 },
    { field: 'groupName', headerName: 'Group Name', width: 250 },
    { field: 'date', headerName: 'Date', width: 200 , valueFormatter: (params) => moment(params.value).format('LLL')},
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 100]}
        pagination
      />
    </div>
  );
};

export default AdminGroupSelectTable;