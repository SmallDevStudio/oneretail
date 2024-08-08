import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const SubGroupTable = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newSubGroup, setNewSubGroup] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSubGroups();
  }, []);

  const fetchSubGroups = async () => {
    try {
      const response = await axios.get('/api/subgroups');
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subgroups?id=${id}`);
      fetchSubGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (subgroup, index) => {
    try {
      await axios.put('/api/subgroups', subgroup);
      setEditIndex(null);
      fetchSubGroups();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('/api/subgroups', newSubGroup);
      setNewSubGroup({ name: '', description: '' });
      fetchSubGroups();
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
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <h2>Add New SubGroup</h2>
      <input 
        type="text" 
        placeholder="Name" 
        value={newSubGroup.name} 
        onChange={(e) => setNewSubGroup({ ...newSubGroup, name: e.target.value })} 
        className='border-2 rounded-xl p-2'
      />
      <input 
        type="text" 
        placeholder="Description" 
        value={newSubGroup.description} 
        onChange={(e) => setNewSubGroup({ ...newSubGroup, description: e.target.value })} 
        className='border-2 rounded-xl p-2 ml-2'
      />
      <button onClick={handleAdd} className='rounded-full bg-blue-500 text-white font-bold py-2 px-4 ml-2'>Add Group</button>
    </div>
  );
};

export default SubGroupTable;
