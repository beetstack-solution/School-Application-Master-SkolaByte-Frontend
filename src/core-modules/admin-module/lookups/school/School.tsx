import React, { useEffect, useState } from 'react'
import { getSchoolProfile, updateSchoolProfileStatus } from '@/api/admin-api/lookups-api/schoolApi';
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrOverview } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHandHolding, FaSchool } from 'react-icons/fa';
import { TbDeviceMobileUp } from 'react-icons/tb';

function School() {
    const BaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [schools, setSchools] = useState<any[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 12;

    const fetchSchools = async (page: number, limit: number) => {
        try {
            const response: any = await getSchoolProfile(page, limit);
            if (response.success) {
                setSchools(response.data?.data);
                setFilteredSchools(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchSchools(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleStatusUpdate = async (id: string, status: boolean) => {
        const newStatus = !status;
        const isConfirmed = window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this school?`);
        if (!isConfirmed) return;
        try {
            const response = await updateSchoolProfileStatus(id, newStatus);
            if (response.success) {
                toast.success(`School ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchSchools(currentPage, itemsPerPage);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const handleSearch = (query: string) => {
        if (query) {
            const filtered = schools.filter(
                (item: any) =>
                    item.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.code?.toLowerCase().includes(query.toLowerCase()) ||
                    item.type?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSchools(filtered);
        } else {
            setFilteredSchools(schools);
        }
        setCurrentPage(1);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Schools", path: "" },
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Schools</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <div className="flex items-center w-full md:w-auto">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Add School Card */}
                <Link to={'/lookups/schools/add/'} className="block">
                    <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 h-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors min-h-[300px]">
                        <div className="bg-blue-100 p-4 rounded-full mb-3">
                            <AiOutlinePlus className="text-blue-600 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Add New School</h3>
                        <p className="text-sm text-gray-500 text-center mt-1">Click to create a new school profile</p>
                    </div>
                </Link>

                {/* School Cards */}
                {filteredSchools.map((school: any) => (
                    <div key={school._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* School Image */}
                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                            {school.imageUrl?.length > 0 ? (
                                <img
                                    src={`${BaseUrl}${school.imageUrl[0]}`}
                                    alt={school.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    <FaSchool size={48} />
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-800 truncate capitalize">
                                    {school.name || "N/A"}
                                </h3>
                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${school.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {school?.status ? "Active" : "Inactive"}
                                </span> */}
                                <button
                                    onClick={() => handleStatusUpdate(school._id, school.status)}
                                    className={`px-2 py-1  rounded-full text-xs font-medium ${school.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} hover:opacity-80`}
                                    title={school.status ? "Deactivate" : "Activate"}
                                >
                                    {school.status ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                            {/* <TbDeviceMobileUp size={18} /> */}
                                            Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600">
                                            {/* <FaHandHolding size={16} /> */}
                                            Inactive
                                        </span>
                                    )}

                                </button>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                                <p className="flex items-center gap-1">
                                    <span className="font-medium">Code:</span>
                                    <span>{school.code || "N/A"}</span>
                                </p>
                                <p className="flex items-center gap-1">
                                    <span className="font-medium">Type:</span>
                                    <span>{school.type || "N/A"}</span>
                                </p>
                                <p className="flex items-center gap-1">
                                    <span className="font-medium">Level:</span>
                                    <span>{school.educationLevel || "N/A"}</span>
                                </p>
                                <p className="flex items-center gap-1">
                                    <span className="font-medium">Board:</span>
                                    <span>{school.boardAffiliation || "N/A"}</span>
                                </p>
                            </div>

                            <div className="flex justify-center items-center pt-3 border-t border-gray-100">
                                <Link
                                    to={`/lookups/schools/view/${school._id}`}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    <GrOverview size={16} />
                                    <span>View Details</span>
                                </Link>

                                {/* <button
                                    onClick={() => handleStatusUpdate(school._id, school.status)}
                                    className={`p-2 rounded-full ${school.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} hover:opacity-80`}
                                    title={school.status ? "Deactivate" : "Activate"}
                                >
                                    {school.status ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600">
                                            Inactive
                                        </span>
                                    )}

                                </button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
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
    )
}

export default School