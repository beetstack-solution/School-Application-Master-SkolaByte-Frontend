import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TbArrowBackUp, TbSchool, TbMapPin, TbPhone, TbMail, TbWorld, TbCalendar, TbUser, TbEdit } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { createdOnBoardedSchoolProfile, getSchoolProfileById, deleteSchoolProfile } from "@/api/admin-api/lookups-api/schoolApi";
import { FaClipboardCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

function ViewSchool() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [schoolData, setSchoolData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [onBoarding, setOnBoarding] = useState(false);
    const [onBoardingProgress, setOnBoardingProgress] = useState(0);
    const fetchSchoolData = async () => {
        if (!id) {
            console.error("School ID is missing");
            return;
        }

        try {
            setLoading(true);
            const response: any = await getSchoolProfileById(id);
            setSchoolData(response.data);
        } catch (error) {
            console.error("Error fetching school data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolData();
    }, [id]);

    const handleOnBoarded = async () => {
        if (!id) {
            toast.error("Invalid school ID");
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to onboard this school?");
        if (!isConfirmed) return;

        try {
            setOnBoarding(true);
            setOnBoardingProgress(0);

            // Simulate progress (you can replace this with actual upload progress if your API supports it)
            const progressInterval = setInterval(() => {
                setOnBoardingProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 300);

            const schoolData = {
                onBoarded: true,
            };
            const response: any = await createdOnBoardedSchoolProfile(id, schoolData);

            clearInterval(progressInterval);
            setOnBoardingProgress(100);

            if (response.success) {
                toast.success(response.message || "School onboarded successfully");
                await fetchSchoolData();
            } else {
                toast.error(response.message || "Failed to onboard school");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred during onboarding";
            toast.error(errorMessage);
        } finally {
            setTimeout(() => {
                setOnBoarding(false);
                setOnBoardingProgress(0);
            }, 500);
        }
    };

    const handleDelete =async ()=>{
        if(!id){
            toast.error("Invalid school ID");
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to delete this school?");
        if (!isConfirmed) return;
        try {
            const response: any = await deleteSchoolProfile(id);
            if (response.success) {
                toast.success(response.message || "School deleted successfully");
                navigate("/lookups/schools");
            } else {
                toast.error(response.message || "Failed to delete school");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred during deletion";
            toast.error(errorMessage);
        }
    }
    const onReturn = () => {
        navigate(-1);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Schools", path: "/lookups/schools" },
        { label: "View School", path: "" },
    ];

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
                    <div className="h-4 bg-blue-100 rounded w-32"></div>
                </div>
            </div>
        );
    }

    if (!schoolData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h3 className="text-xl font-medium text-gray-700">Failed to load school data</h3>
                    <button
                        onClick={fetchSchoolData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">School Profile</h3>
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                   
                    <button
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                        onClick={() => navigate(`/lookups/schools/edit/${id}`)}
                    >
                        <TbEdit size={18} className="mr-2" />
                        Edit
                    </button>
                    <button
                        className={`flex items-center px-4 py-2 bg-cyan-900 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm ${onBoarding ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={handleOnBoarded}
                        disabled={onBoarding}
                    >
                        {onBoarding ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Onboarding ({onBoardingProgress}%)
                            </>
                        ) : (
                            <>
                                <FaClipboardCheck size={18} className="mr-2" />
                                On Board
                            </>
                        )}
                    </button>
                    {onBoarding && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${onBoardingProgress}%` }}
                            ></div>
                        </div>
                    )}
                    <button
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-sm"
                        onClick={handleDelete}
                    >
                        <MdDeleteOutline size={18} className="mr-2" />
                        Delete
                    </button>
                    <button
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
                        onClick={onReturn}
                    >
                        <TbArrowBackUp size={18} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>

            {/* School Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* School Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/10 p-3 rounded-lg flex items-center justify-center">
                                <TbSchool size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{schoolData.name}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="bg-white/20 px-2 py-1 rounded-md text-sm">{schoolData.code}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-md text-sm capitalize">{schoolData.type}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-md text-sm capitalize">{schoolData.educationLevel}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg min-w-[200px]">
                            <p className="text-sm font-medium opacity-90">Board Affiliation</p>
                            <p className="text-lg font-semibold">{schoolData.boardAffiliation || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Address Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <TbMapPin size={20} className="text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Street</p>
                                        <p className="font-medium">{schoolData.address.street || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">City</p>
                                        <p className="font-medium">{schoolData.address.city || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">State</p>
                                        <p className="font-medium">{schoolData.address.state || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Country</p>
                                        <p className="font-medium">{schoolData.address.country || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Postal Code</p>
                                        <p className="font-medium">{schoolData.address.postalCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <TbPhone size={20} className="text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                                        <p className="font-medium">{schoolData.contact.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        {schoolData.contact.email ? (
                                            <a
                                                href={`mailto:${schoolData.contact.email}`}
                                                className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <TbMail size={16} />
                                                {schoolData.contact.email}
                                            </a>
                                        ) : (
                                            <p className="font-medium">N/A</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Website</p>
                                        {schoolData.contact.website ? (
                                            <a
                                                href={schoolData.contact.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <TbWorld size={16} />
                                                {schoolData.contact.website.replace(/(^\w+:|^)\/\//, '')}
                                            </a>
                                        ) : (
                                            <p className="font-medium">N/A</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Facilities Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Facilities</h2>
                                {schoolData.facilities ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(schoolData.facilities)
                                            .filter(([_, value]) => value === true)
                                            .map(([facility]) => (
                                                <div key={facility} className="flex items-center">
                                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                                                    <span className="text-sm capitalize">{facility.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </div>
                                            ))
                                        }
                                        {Object.values(schoolData.facilities).filter(val => val === true).length === 0 && (
                                            <p className="text-gray-400 col-span-full">No facilities available</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No facilities information available</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Meta Info */}
                        <div className="space-y-6">
                            {/* Meta Information */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">School Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <TbUser size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created By</p>
                                            <p className="font-medium">
                                                {schoolData.createdBy?.name || 'System'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <TbCalendar size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="font-medium">
                                                {formatDate(schoolData.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {schoolData.updatedBy && Object.keys(schoolData.updatedBy).length > 0 && (
                                        <>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <TbUser size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Updated By</p>
                                                    <p className="font-medium">
                                                        {schoolData.updatedBy?.name || 'System'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <TbCalendar size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Updated At</p>
                                                    <p className="font-medium">
                                                        {formatDate(schoolData.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Branch Details Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Branch Details</h2>
                                {schoolData.branchDetails && schoolData.branchDetails.length > 0 ? (
                                    <div className="space-y-4">
                                        {schoolData.branchDetails.map((branch: any, index: number) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium">{branch.name}</h3>
                                                        <p className="text-gray-500 text-sm">Code: {branch.code}</p>
                                                    </div>
                                                </div>

                                                {branch.address && branch.address.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <h4 className="font-medium text-sm mb-2 text-gray-700">Address</h4>
                                                        <div className="text-sm space-y-1">
                                                            <p className="text-gray-600">{branch.address[0].street}</p>
                                                            <p className="text-gray-600">{branch.address[0].city}, {branch.address[0].state}</p>
                                                            <p className="text-gray-600">{branch.address[0].country}, {branch.address[0].postalCode}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-4">No branch details available</p>
                                )}
                            </div>

                            {/* Image Gallery */}
                            {schoolData.imageUrl && schoolData.imageUrl.length > 0 ? (
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Gallery</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {schoolData.imageUrl.map((img: string, index: number) => (
                                            <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                                                <img
                                                    src={`${baseUrl}${img}`}
                                                    alt={`School ${index + 1}`}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex flex-col items-center justify-center py-8">
                                    <div className="bg-gray-200 p-4 rounded-full mb-3">
                                        <TbSchool size={24} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-400">No images available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSchool;