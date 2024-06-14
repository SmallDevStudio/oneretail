import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import ReactPaginate from 'react-paginate';
import { AdminLayout } from '@/themes';

const LogsPage = () => {
  const [sendPointCoinsLogs, setSendPointCoinsLogs] = useState([]);
  const [qrCodeLogs, setQRCodeLogs] = useState([]);
  const [searchEmpId, setSearchEmpId] = useState('');
  const [searchEmpIdSendPoint, setSearchEmpIdSendPoint] = useState('');

  useEffect(() => {
    fetchSendPointCoinsLogs();
    fetchQRCodeLogs();
  }, []);

  const fetchSendPointCoinsLogs = async () => {
    try {
      const response = await axios.get('/api/sendpointcoins/logs');
      setSendPointCoinsLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching SendPointCoins logs:', error);
    }
  };

  const fetchQRCodeLogs = async () => {
    try {
      const response = await axios.get('/api/qrcode/logs');
      setQRCodeLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching QRCode logs:', error);
    }
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  };

  const sendPointCoinsDataForExport = sendPointCoinsLogs.map(log => ({
    ...log,
    createdAt: log.createdAt // Already formatted in API
  }));

  const qrCodeDataForExport = qrCodeLogs.map(log => ({
    ...log,
    createdAt: log.createdAt, // Already formatted in API
    hasUser: log.hasUser,
    userDetails: log.userDetails
  }));

  const filteredSendPointCoinsLogs = useMemo(() => {
    if (!searchEmpIdSendPoint) return sendPointCoinsLogs;
    return sendPointCoinsLogs.filter(log => log.empId.includes(searchEmpIdSendPoint));
  }, [sendPointCoinsLogs, searchEmpIdSendPoint]);

  const filteredQRCodeLogs = useMemo(() => {
    if (!searchEmpId) return qrCodeLogs;
    return qrCodeLogs.filter(log => log.empId.includes(searchEmpId));
  }, [qrCodeLogs, searchEmpId]);

  const sendPointCoinsColumns = useMemo(
    () => [
      { Header: 'userId', accessor: 'userId' },
      { Header: 'empId', accessor: 'empId' },
      { Header: 'fullname', accessor: 'fullname' },
      { Header: 'trans', accessor: 'trans' },
      { Header: 'ref', accessor: 'ref' },
      { Header: 'point', accessor: 'point' },
      { Header: 'coins', accessor: 'coins' },
      { Header: 'remark', accessor: 'remark' },
      { Header: 'createdAt', accessor: 'createdAt' },
    ],
    []
  );

  const qrCodeColumns = useMemo(
    () => [
      { Header: 'userId', accessor: 'userId' },
      { Header: 'empId', accessor: 'empId' },
      { Header: 'fullname', accessor: 'fullname' },
      { Header: 'point', accessor: 'point' },
      { Header: 'coins', accessor: 'coins' },
      { Header: 'ref', accessor: 'ref' },
      { Header: 'remark', accessor: 'remark' },
      { Header: 'createdAt', accessor: 'createdAt' },
      { Header: 'Has User', accessor: 'hasUser' },
      { Header: 'User Details', accessor: 'userDetails' },
    ],
    []
  );

  const sendPointCoinsTable = useTable(
    { columns: sendPointCoinsColumns, data: filteredSendPointCoinsLogs },
    useGlobalFilter,
    usePagination
  );

  const qrCodeTable = useTable(
    { columns: qrCodeColumns, data: filteredQRCodeLogs },
    useGlobalFilter,
    usePagination
  );

  const handlePageChange = (tableInstance, pageIndex) => {
    tableInstance.gotoPage(pageIndex.selected);
  };

  const renderTable = (tableInstance) => (
    <>
      <table {...tableInstance.getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead
            className='bg-[#FF9800]/50'
        >
          {tableInstance.headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '5px' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...tableInstance.getTableBodyProps()}>
          {tableInstance.page.map(row => {
            tableInstance.prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  // eslint-disable-next-line react/jsx-key
                  <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '5px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={tableInstance.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(pageIndex) => handlePageChange(tableInstance, pageIndex)}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </>
  );

  return (
    <div className="flex flex-col p-10 w-full">
      <h1 className="text-3xl font-bold mb-2 text-[#0056FF]">Transaction Logs</h1>
      
      <h2 className='text-lg font-bold mb-2'>SendPointCoins Logs</h2>
      <div className='mb-2 flex flex-row justify-between'>
        <input
            type="text"
            placeholder="Search empId"
            value={searchEmpIdSendPoint}
            onChange={(e) => setSearchEmpIdSendPoint(e.target.value)}
            className='border border-gray-300 p-2 rounded-xl bg-gray-200 mb-2 w-1/4'
        />
        <button onClick={() => exportToExcel(sendPointCoinsDataForExport, 'sendpointcoins_logs.xlsx')}
                className='border border-gray-300 p-2 rounded-xl bg-[#0056FF] mb-2 w-1/6 text-white font-bold'    
        >
            Export to Excel
        </button>
      </div>
      {renderTable(sendPointCoinsTable)}

      <h2 className='text-lg font-bold mb-2'>QRCode Logs</h2>
      <div className='mb-2 flex flex-row justify-between'>
        <input
            type="text"
            placeholder="Search empId"
            value={searchEmpId}
            onChange={(e) => setSearchEmpId(e.target.value)}
            className='border border-gray-300 p-2 rounded-xl bg-gray-200 mb-2 w-1/4'
        />
        <button onClick={() => exportToExcel(qrCodeDataForExport, 'qrcode_logs.xlsx')}
            className='border border-gray-300 p-2 rounded-xl bg-[#0056FF] mb-2 w-1/6 text-white font-bold'     
        >
            Export to Excel
        </button>
      </div>
      {renderTable(qrCodeTable)}
    </div>
  );
};

LogsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default LogsPage;
