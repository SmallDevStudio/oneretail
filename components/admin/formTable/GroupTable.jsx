import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const GroupTable = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/groups');
      setData(response.data.data);
      setPageCount(Math.ceil(response.data.total / 10)); // Assuming 10 items per page
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setLoading(false);
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
    [data, editIndex]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Start from the first page
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className={styles.pagination}>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      
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
