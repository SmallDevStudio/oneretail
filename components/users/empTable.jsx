import React,{ useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { Autocomplete, TextField, Dialog, Slide } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from "../admin/global/Header";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import EmpForm from "./empForm";

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export default function EmpTable() {
    const [emps, setEmps] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState({});

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
        { field: 'teamGrop', headerName: 'TeamGroup', width: 100 },
        { field: 'group', headerName: 'Group', width: 100 },
        { field: 'position', headerName: 'Position', width: 100 },
        { field: 'department', headerName: 'Department', width: 400 },
        { field: 'chief_eng', headerName: 'ChiefEng', width: 100 },
        { field: 'chief_th', headerName: 'ChiefTh', width: 200 },
        { field: 'branch', headerName: 'Branch', width: 200 },
        { field: 'action', headerName: 'Acion', width: 200,
            renderCell: (params) => (
                <div className="flex flex-row items-center justify-center gap-4 p-2">
                    <FaEdit size={25}/>
                    <RiDeleteBinLine size={25} />
                </div>
            )
         },
    ];

    const handleOpen = (emp) => {
        setSelectedEmp(emp);
        setOpenForm(true);
    }
    const handleClose = () => {
        setSelectedEmp({});
        setOpenForm(false);
    }

    console.log('emp', emps);

    return (
        <div className="flex flex-col w-full">
            <Header title={'จัดการข้อมูลพนักงาน'}/>
            {/* Header */}
            <div className="flex flex-row items-center justify-between w-full p-2">
                <button
                    className="flex bg-[#0056FF] rounded-full px-4 py-1 text-white font-bold"
                    onClick={() => handleOpen({})}
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
                    />
                </div>
            </Dialog>
        </div>
    );
}