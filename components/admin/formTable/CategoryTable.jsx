import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const CategoryTable = () => {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newCategory, setNewCategory] = useState({ title: '', subtitle: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setData(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/categories?id=${id}`);
    fetchCategories();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (category, index) => {
    await axios.put('/api/categories', category);
    setEditIndex(null);
    fetchCategories();
  };

  const handleAdd = async () => {
    await axios.post('/api/categories', newCategory);
    setNewCategory({ title: '', subtitle: '' });
    fetchCategories();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ row, value }) => (
          editIndex === row.index ? 
            <input 
              value={value} 
              onChange={(e) => {
                const newData = [...data];
                newData[row.index].title = e.target.value;
                setData(newData);
              }}
              className={styles.input}
            /> 
            : value
        )
      },
      {
        Header: 'Subtitle',
        accessor: 'subtitle',
        Cell: ({ row, value }) => (
          editIndex === row.index ? 
            <input 
              value={value} 
              onChange={(e) => {
                const newData = [...data];
                newData[row.index].subtitle = e.target.value;
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
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
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
      
      <h2>Add New Category</h2>
      <input 
        type="text" 
        placeholder="Title" 
        value={newCategory.title} 
        onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} 
        className={styles.input}
      />
      <input 
        type="text" 
        placeholder="Subtitle" 
        value={newCategory.subtitle} 
        onChange={(e) => setNewCategory({ ...newCategory, subtitle: e.target.value })} 
        className={styles.input}
      />
      <button onClick={handleAdd} className={styles.button}>Add Category</button>
    </div>
  );
};

export default CategoryTable;