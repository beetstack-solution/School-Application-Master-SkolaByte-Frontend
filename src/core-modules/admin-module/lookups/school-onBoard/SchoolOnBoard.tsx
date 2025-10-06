import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper';
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSchoolOnboardList } from '@/api/admin-api/lookups-api/schoolOnBoardApi';

function SchoolOnBoard() {
    const [schools, setSchools] = useState<any[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortState, setSortState] = useState({
        column: "schoolCode",
        order: "ascending",
    });
    const navigate = useNavigate();
    const itemsPerPage = 25;

    const fetchSchools = async () => {
        try {
            const response: any = await getSchoolOnboardList();
            if (response.success) {
                setSchools(response.data);
                setFilteredSchools(response.data);
                setTotalItems(response.data.length);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchSchools();
    }, []);

    // const handleEditShow = (id: string) => {
    //     navigate(`/lookups/schools/edit/${id}`);
    // }

    // const handleStatusUpdate = async (id: string, status: boolean) => {
    //     const newStatus = !status;
    //     const isConfirmed = window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this school?`);
    //     if (!isConfirmed) return;
    //     try {
    //         // You'll need to implement updateSchoolStatus API call
    //         // const response = await updateSchoolStatus(id, newStatus);
    //         // if (response.success) {
    //         //     toast.success(`School ${newStatus ? 'activated' : 'deactivated'} successfully`);
    //         //     fetchSchools(currentPage, itemsPerPage);
    //         // }
    //         toast.info("Status update functionality to be implemented");
    //     } catch (error: any) {
    //         toast.error(error.response?.data?.message || error.message);
    //     }
    // }

    // const handleDelete = async (id: string) => {
    //     const isConfirmed = window.confirm("Are you sure you want to delete this school?");
    //     if (!isConfirmed) return;
    //     try {
    //         // You'll need to implement deleteSchool API call
    //         // const response = await deleteSchool(id);
    //         // if (response.success) {
    //         //     toast.success(response.message || "School deleted successfully");
    //         //     fetchSchools(currentPage, itemsPerPage);
    //         // } else {
    //         //     toast.error(response.message || "Failed to delete school");
    //         // }
    //         toast.info("Delete functionality to be implemented");
    //     } catch (error: any) {
    //         toast.error(error.response?.data?.message || error.message);
    //     }
    // }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const changeSort = (column: string) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredSchools].sort((a: any, b: any) => {
            // Handle nested properties
            let aValue, bValue;
            if (column.includes('.')) {
                const keys = column.split('.');
                aValue = keys.reduce((obj, key) => obj?.[key], a);
                bValue = keys.reduce((obj, key) => obj?.[key], b);
            } else {
                aValue = a[column];
                bValue = b[column];
            }

            if (aValue < bValue) return order === "ascending" ? -1 : 1;
            if (aValue > bValue) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredSchools(sortedData);
    };

    const handleSearch = (query: string) => {
        if (query) {
            const filtered = schools.filter((item: any) => 
                item.schoolCode?.toLowerCase().includes(query.toLowerCase()) ||
                item.schoolId?.name?.toLowerCase().includes(query.toLowerCase()) ||
                item.schoolId?.type?.toLowerCase().includes(query.toLowerCase()) ||
                item.schoolId?.educationLevel?.toLowerCase().includes(query.toLowerCase()) ||
                item.schoolId?.boardAffiliation?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSchools(filtered);
        } else {
            setFilteredSchools(schools);
        }
        setCurrentPage(1);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Schools OnBoard", path: "" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4r">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Schools OnBoard</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <Link to={'/lookups/schools/add/'} className="w-full md:w-auto">
                            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                                <RiPlayListAddFill className="text-lg" />
                                Add
                            </button>
                        </Link>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    {[
                                        { name: "Sl No.", width: "w-16" },
                                        { name: "Actions", width: "w-24" },
                                        { name: "Status", width: "w-20" },
                                        { name: "School Name", width: "w-48" },
                                        { name: "School Code", width: "w-24" },
                                        { name: "Type", width: "w-24" },
                                        { name: "Education Level", width: "w-32" },
                                        { name: "Board", width: "w-32" },
                                        { name: "Database", width: "w-48" },
                                        { name: "Username", width: "w-32" },
                                        { name: "Created At", width: "w-32" }
                                    ].map((header) => (
                                        <th 
                                            key={header.name} 
                                            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
                                            onClick={() => {
                                                const columnMap: Record<string, string> = {
                                                    "School Name": "schoolId.name",
                                                    "School Code": "schoolCode",
                                                    "Type": "schoolId.type",
                                                    "Education Level": "schoolId.educationLevel",
                                                    "Board": "schoolId.boardAffiliation",
                                                    "Database": "dbName",
                                                    "Username": "username",
                                                    "Created At": "createdAt"
                                                };
                                                if (columnMap[header.name]) {
                                                    changeSort(columnMap[header.name]);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header.name}
                                                <AiFillCaretUp className="text-gray-400 text-xs" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSchools.map((item: any, index: number) => (
                                    <tr className="hover:bg-gray-50" key={item._id}>
                                        <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/lookups/school-onboard/view/${item._id}`}>
                                                    <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                                </Link>
                                                {/* <CiEdit
                                                    size={22}
                                                    title="Edit"
                                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                                    onClick={() => handleEditShow(item._id)}
                                                /> */}
                                                {/* <MdDeleteOutline
                                                    size={20}
                                                    title="Delete"
                                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                                    onClick={() => handleDelete(item._id)}
                                                /> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium  ${item.status
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    } `}
                                                // onClick={() => handleStatusUpdate(item._id, item.status)}
                                            >
                                                {item?.status ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs capitalize">
                                            {item?.schoolId?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.schoolCode || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs capitalize">
                                            {item?.schoolId?.type || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs capitalize">
                                            {item?.schoolId?.educationLevel || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.schoolId?.boardAffiliation || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs font-mono">
                                            {item?.dbName || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs font-mono">
                                            {item?.username || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {formatDate(item?.createdAt || "N/A")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SchoolOnBoard