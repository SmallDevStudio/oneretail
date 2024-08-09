import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const GroupTable = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/groups');
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`/api/groups?id=${id}`);
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = useCallback(async (group, index) => {
    try {
      await axios.put('/api/groups', group);
      setEditIndex(null);
      fetchGroups();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post('/api/groups', newGroup);
      setNewGroup({ name: '', description: '' });
      fetchGroups();
    } catch (error) {
      console.error('Failed to add group:', error);
    }
  };

  const columns = useMemo(
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
    [data, editIndex, handleDelete, handleSave]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows, // Use `rows` instead of `page` to show all rows
  } = useTable({ columns, data });

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, colIndex) => (
                <th key={colIndex} {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr key={rowIndex} {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
