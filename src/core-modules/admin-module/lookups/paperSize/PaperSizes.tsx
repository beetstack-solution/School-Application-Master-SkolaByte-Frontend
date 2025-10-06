import { deletePaperSize, getPaperSizes } from '@/api/admin-api/lookups-api/paperSizeApi';
import { deletePtaRole, getPtaRoles, updatePtaRoleStatusById } from '@/api/admin-api/lookups-api/ptaRolesApi';
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper';
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditPaperSize from './EditPapersize';
import AddPaperSize from './AddPaperSize';
// import AddPtaRole from './AddPtaRole';
// import EditPtaRole from './EditPtaRole';
// import AddVehicleType from './AddVehicleType';
// import EditVehicileType from './EditVehicileType';
// import AddFeeType from './AddFeeType';
// import EditFeeType from './EditFeeType';

function PaperSizes() {
    const [filteredTransportVehicles, setFilteredTransportVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [totalItems, setTotalItems] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [sortState, setSortState] = useState({
        column: "code",
        order: "ascending",
    });
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedFeeStructureName, setSelectedFeeStructureName] = useState<string>("");
    const navigate = useNavigate();
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleEditShow = (feeStructureId: string) => {
        setSelectedId(feeStructureId);
        setShowEdit(true);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
    };

   
    const getAllPaperSize = async (page: number, limit: number) => {
        setLoading(true);

        try {
            const response: any = await getPaperSizes(page, limit);
            if (response.success) {
                setFilteredTransportVehicles(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                setError("Failed to fetch Paper Size.");
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        getAllPaperSize(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleReload = () => {
        getAllPaperSize(currentPage, itemsPerPage);
    };

    const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
        const newStatus: any = !currentStatus;
        const isConfirmed = window.confirm(
            `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
        );
        if (!isConfirmed) return;

        try {
            const response: any = await updatePtaRoleStatusById(_id, newStatus);
            if (response?.success) {
                toast.success(
                    response.message || `Paper Size status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                getAllPaperSize(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to update Paper Size status.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update Paper Size status.");
        }
    };

    const handleSearch = (query: string) => {
        if (query) {
            const filtered = filteredTransportVehicles.filter((item) => {
                const matchesCode = item.code?.toLowerCase().includes(query.toLowerCase());

                const matchesVehicleInfo = item.vehicleInfo?.some((v: any) =>
                    v.vehicleNumber?.toLowerCase().includes(query.toLowerCase()) ||
                    v.driver?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    v.assistant?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    v.route?.routeName?.toLowerCase().includes(query.toLowerCase())
                );

                return matchesCode || matchesVehicleInfo;
            });

            setFilteredTransportVehicles(filtered);
        } else {
            getAllPaperSize(currentPage, itemsPerPage);
        }

        setCurrentPage(1);
    };

    const changeSort = (column: any) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredTransportVehicles].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredTransportVehicles(sortedData);
    };

    const handleDelete = async (feeStructureId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Paper Size?"
        );
        if (!confirmDelete) return;

        try {
            const response: any = await deletePaperSize(feeStructureId);
            if (response.success) {
                toast.success(response.message || "Paper Size deleted successfully!");
                getAllPaperSize(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to delete Paper Size.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete Paper Size.");
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // const onReturn = () => {
    //     navigate("/lookups/pta-roles/add/");
    // };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Paper Size", path: "" },
    ];
    return (


        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* Message Popup */}
            {/* {message && (
       <MessagePopup
         message={message.text}
         type={message.type}
         onClose={() => setMessage(null)}
         duration={4000}
       />
     )} */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Paper Size</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <button onClick={() => handleShow()} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                            <RiPlayListAddFill className="text-lg" />
                            Add
                        </button>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>




                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                //  style={{ height: 'calc(100vh - 200px)' }}
                >
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Sl No
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    


                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("createdAt")}
                                    >
                                        <div className="flex items-center">
                                            Created At
                                            {sortState.column === "createdAt" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredTransportVehicles?.map((item, index) => (
                                    <tr className="hover:bg-gray-50" key={item._id} >
                                        <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* <Link to={`/lookups/pta-role/view/${item._id}`}>
                                                    <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                                </Link> */}
                                                {/* <Link to={`/lookups/fee-structures/edit/${item._id}`}> */}
                                                <CiEdit
                                                    size={20}
                                                    title="Edit"
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={() => handleEditShow(item._id)}
                                                />
                                                {/* </Link> */}

                                                <MdDeleteOutline
                                                    size={18}
                                                    title="Delete"
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={() => handleDelete(item._id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.name}</td>
                                       
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{formatDate(item.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center px-1">
                    <div className="total-count">
                        <span>Total: {totalItems}</span>
                        &nbsp;|&nbsp;
                        <span>Page Count: {rowsPerPage}</span>
                    </div>
                    <div className="pagination flex items-center gap-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <AddPaperSize onClose={handleClose} onReload={handleReload} />
                        </div>
                    </div>
                )}
                
                {showEdit && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <EditPaperSize
                                ptaRoleId={selectedId}
                                onClose={handleCloseEdit}
                                onReload={handleReload}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaperSizes