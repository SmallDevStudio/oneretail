import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import styles from '@/styles/CategoryTable.module.css';

const SubcategoryTable = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState({ title: '', subtitle: '', category: '' });

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    const response = await axios.get('/api/subcategories');
    setData(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/subcategories?id=${id}`);
    fetchSubcategories();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (subcategory, index) => {
    await axios.put('/api/subcategories', subcategory);
    setEditIndex(null);
    fetchSubcategories();
  };

  const handleAdd = async () => {
    await axios.post('/api/subcategories', newSubcategory);
    setNewSubcategory({ title: '', subtitle: '', category: '' });
    fetchSubcategories();
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
      
      <h2>Add New Subcategory</h2>
      <input 
        type="text" 
        placeholder="Title" 
        value={newSubcategory.title} 
        onChange={(e) => setNewSubcategory({ ...newSubcategory, title: e.target.value })} 
        className={styles.input}
      />
      <input 
        type="text" 
        placeholder="Subtitle" 
        value={newSubcategory.subtitle} 
        onChange={(e) => setNewSubcategory({ ...newSubcategory, subtitle: e.target.value })} 
        className={styles.input}
      />
      <select
        value={newSubcategory.category}
        onChange={(e) => setNewSubcategory({ ...newSubcategory, category: e.target.value })}
        className={styles.input}
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.title}
          </option>
        ))}
      </select>
      <button onClick={handleAdd} className={styles.button}>Add Subcategory</button>
    </div>
  );
};

export default SubcategoryTable;