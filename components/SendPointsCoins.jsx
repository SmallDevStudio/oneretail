// components/SendPointsCoins.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Loading from './Loading';

const SendPointsCoins = () => {
  const { data: session } = useSession();
  const [empIds, setEmpIds] = useState([]);
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);
  const [point, setPoint] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ref, setRef] = useState('');
  const [remark, setRemark] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users/emp'); // Adjust the API endpoint as necessary
        setUsers(res.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire('Error', 'Could not fetch users.', 'error');
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    setLoading(true);
    try {
      const adminUserId = session?.user?.id;

      const transactions = selectedEmpIds.map(empId => {
        return {
          empId,
          point,
          coins,
          ref,
          remark,
        };
      });

      for (let transaction of transactions) {
        const user = users.find(user => user.empId === transaction.empId);
        if (!user) continue;

        await axios.post('/api/sentpointcoins', {
          adminUserId,
          empId: transaction.empId,
          point: transaction.point,
          coins: transaction.coins,
          ref: transaction.ref,
          remark: transaction.remark,
        });
      }
      // Clear form
      setSelectedEmpIds([]);
      setPoint(0);
      setCoins(0);
      setRef('');
      setRemark('');

      Swal.fire('Success', 'Points and coins sent successfully!', 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error sending points and coins:', error);
      Swal.fire('Error', 'Error sending points and coins.', 'error');
      setLoading(false);
    }
  };

  if(loading) return <Loading />;

  return (
    <div className="p-4">
        <div className="flex justify-center items-center">
        <h2 className="text-2xl font-bold text-[#0056FF] mb-3">
            Send Points and Coins
        </h2>
        </div>
        <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => `${option.empId} - ${option.fullname} - ${option.teamGrop ? option.teamGrop : 'No Team'}`}
            renderOption={(props, option) => (
            <li {...props} key={option.empId}>
                {`${option.empId} - ${option.fullname} - ${option.teamGrop ? option.teamGrop : 'No Team'}`}
            </li>
            )}
            onChange={(event, newValue) => {
            setSelectedEmpIds(newValue.map(user => user.empId));
            }}
            renderInput={(params) => (
            <TextField
                {...params}
                variant="outlined"
                label="Select Users by empId"
                placeholder="EmpId"
            />
            )}
        />
      <div className="flex flex-row mt-5">
        <div className="flex flex-row items-center">
            <label className='font-bold'>Points:</label>
            <input
            type="number"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            className="w-1/2 border-2 ml-2 rounded-xl text-center"
            />
        </div>
        <div className="flex flex-row items-center">
            <label className='font-bold'>Coins:</label>
            <input
            type="number"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="w-1/2 border-2 ml-2 rounded-xl text-center"
            />
        </div>
      </div>
      <div className="flex flex-row mt-2 items-center">
        <label className='font-bold'>Reference:</label>
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className="w-full border-2 ml-2 rounded-xl"
        />
      </div>
      <div className="flex flex-row mt-2 items-center">
        <label className='font-bold'>Remark:</label>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full border-2 ml-2 rounded-xl"
        />
      </div>
      <div className="flex mt-2 justify-center">
        <button onClick={handleSend}
          className="bg-[#0056FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-1/2 mt-2"
        >
            {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default SendPointsCoins;
