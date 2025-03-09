import React,{ useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { Autocomplete, TextField, Dialog, Slide } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from "../admin/global/Header";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import EmpForm from "./empForm";
import Swal from "sweetalert2";

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="top" ref={ref} {...props} />;
});

export default function EmpTable() {
    const [emps, setEmps] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);

    const { data, error, mutate } = useSWR('/api/emp', fetcher, {
        onSuccess: (data) => {
            setEmps(data.data);
        }
    });

    useEffect(() => {
        if (!emps) return;

        if (search) {
            const filter = emps.filter(emp => 
                emp.empId.includes(search.toLowerCase()) ||
                emp.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilterData(filter);
        } else {
            setFilterData(emps);
        }
    }, [emps, search])

    const columns =[
        { field: 'empId', headerName: 'EmpId', width: 100,},
        { field: 'name', headerName: 'Name', width: 200,},
        { field: 'sex', headerName: 'Sex', width: 80,},
        { field: 'teamGrop', headerName: 'TeamGroup', width: 100 },
        { field: 'group', headerName: 'Group', width: 100 },
        { field: 'position', headerName: 'Position', width: 100 },
        { field: 'department', headerName: 'Department', width: 200 },
        { field: 'chief_eng', headerName: 'ChiefEng', width: 100 },
        { field: 'chief_th', headerName: 'ChiefTh', width: 200 },
        { field: 'branch', headerName: 'Branch', width: 200 },
        { field: 'action', headerName: 'Acion', width: 200,
            renderCell: (params) => (
                <div className="flex flex-row items-center justify-center gap-4 p-2">
                    <FaEdit size={25}
                        className="text-[#0056FF] cursor-pointer"
                        onClick={() => handleSelectedEmp(params.row)}
                    />
                    <RiDeleteBinLine size={25} 
                        className="text-[#FF0000] cursor-pointer"
                        onClick={() => handleDeleteEmp(params.row.empId)}
                    />
                </div>
            )
         },
    ];

    const handleOpen = () => {
        setOpenForm(true);
    }
    const handleClose = () => {
        setSelectedEmp(null);
        setOpenForm(false);
    }

    const handleSelectedEmp = (emp) => {
        setSelectedEmp(emp);
        setOpenForm(true);
    }

    const handleDeleteEmp = async (empId) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบข้อมูลพนักงานใช่หรือไม่?',
            text: 'คุณจะไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0056FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
            await axios.delete(`/api/emp/${empId}`);
            mutate();
            Swal.fire('ลบข้อมูลพนักงานเรียบร้อยแล้ว', '', 'success');
        }
    }

    return (
        <div className="flex flex-col w-full">
            <Header title={'จัดการข้อมูลพนักงาน'}/>
            {/* Header */}
            <div className="flex flex-row items-center justify-between w-full p-2">
                <button
                    className="flex bg-[#0056FF] rounded-full px-4 py-1 text-white font-bold"
                    onClick={() => handleOpen()}
                >
                    เพื่มข้อมูลพนักงาน
                </button>
                {/* Search */}
                <div className="flex flex-row items-center">
                    <input
                        type="text"
                        name="search"
                        placeholder="ค้นหา"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                        className="flex border border-gray-300 px-2 py-1 rounded-full"
                    />
                </div>
            </div>

            <DataGrid 
                rows={filterData} 
                columns={columns} 
                pageSize={10} 
                loading={loading} 
                getRowId={(row) => row._id} 
            />

            <div></div>

            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        maxWidth: '500px',
                        borderRadius: '15px',
                    }
                }}
            >
                <div className="flex flex-col p-4">
                    {/* Header */}
                    <div>

                    </div>
                    
                    {/* Form */}
                    <EmpForm
                        empData={selectedEmp}
                        mutate={mutate}
                        handleClose={handleClose}
                    />
                </div>
            </Dialog>
        </div>
    );
}