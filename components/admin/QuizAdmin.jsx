// components/admin/QuizAdmin.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import AdminGroupSelectTable from './AdminGroupSelectTable';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const QuizAdmin = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const { data: session } = useSession();

  console.log('groupName:', groupName);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('/api/quizGroups');
        setGroups(res.data.data);
        setLoading(false);
      } catch (error) {
        setMessage('Error loading groups');
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleSaveSelection = async () => {
    const newGroupName = {
        adminId: session.user.id,
        groupName: groupName,
    }

    console.log('newGroupName:', newGroupName);
    try {
      await axios.post('/api/adminActions', newGroupName);
      setMessage('Selection saved successfully');
    } catch (error) {
      setMessage('Error saving selection');
    }
  };

  const handleUpdateGroups = async () => {
    try {
      await axios.put('/api/quizGroups');
      const res = await axios.get('/api/quizGroups');
      setGroups(res.data.data);
      setMessage('Groups updated successfully');
    } catch (error) {
      setMessage('Error updating groups');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="group-select-label">Select Group</InputLabel>
        <Select
          labelId="group-select-label"
          value={groupName}
          onChange={handleGroupChange}
        >
          <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
          {groups.map(group => (
            <MenuItem key={group._id} value={group.name}>{group.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleSaveSelection} variant="contained" color="primary">
        Save Selection
      </Button>
      <Button onClick={handleUpdateGroups} variant="contained" color="secondary">
        Update Groups
      </Button>
      {message && <p>{message}</p>}
      <div className="mt-4">
          <AdminGroupSelectTable />
      </div>
    </div>
  );
};

export default QuizAdmin;
