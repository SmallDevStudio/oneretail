import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const GroupTable = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/groups?id=${id}`);
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (group, index) => {
    try {
      await axios.put('/api/groups', group);
      setEditIndex(null);
      fetchGroups();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('/api/groups', newGroup);
      setNewGroup({ name: '', description: '' });
      fetchGroups();
    } catch (error) {
      console.error('Failed to add group:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row, value }) => (
          editIndex === row.index ? 
            <input 
              value={value} 
              onChange={(e) => {
                const newData = [...data];
                newData[row.index].name = e.target.value;
                setData(newData);
              }}
              className={styles.input}
            /> 
            : value
        )
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ row, value }) => (
          editIndex === row.index ? 
            <input 
              value={value} 
              onChange={(e) => {
                const newData = [...data];
                newData[row.index].description = e.target.value;
                setData(newData);
              }}
              className={styles.input}
            /> 
            : value
        )
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          editIndex === row.index ? 
            <>
              <button onClick={() => handleSave(row.original, row.index)} className={styles.button}>Save</button>
              <button onClick={() => setEditIndex(null)} className={styles.button}>Cancel</button>
            </>
            :
            <>
              <button onClick={() => handleEdit(row.index)} className={styles.button}>Edit</button>
              <button onClick={() => handleDelete(row.original._id)} className={styles.button}>Delete</button>
            </>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, editIndex]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable({ columns, data }, usePagination);

  return (
    <div className={styles.container}>
    
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  // eslint-disable-next-line react/jsx-key
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <h2>Add New Group</h2>
      <input 
        type="text" 
        placeholder="Name" 
        value={newGroup.name} 
        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} 
        className='border-2 rounded-xl p-2'
      />
      <input 
        type="text" 
        placeholder="Description" 
        value={newGroup.description} 
        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} 
       className='border-2 rounded-xl p-2 ml-2'
      />
      <button onClick={handleAdd} className='rounded-full bg-blue-500 text-white font-bold py-2 px-4 ml-2'>Add Group</button>
    </div>
  );
};

export default GroupTable;