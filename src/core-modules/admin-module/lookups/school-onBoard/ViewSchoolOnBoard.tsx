import { getSchoolOnboardById } from '@/api/admin-api/lookups-api/schoolOnBoardApi'
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  TbArrowBackUp, 
  TbSchool, 
  TbMapPin, 
  TbPhone, 
  TbMail, 
  TbWorld, 
  TbCalendar, 
  TbUser, 
  TbEdit,
  TbBuilding,
  TbBook,
  TbFlask,
  TbSportBillard,
  TbBus,
  TbHome,
  TbPhoto
} from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";

function ViewSchoolOnBoard() {
    const BaseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [schoolOnboard, setSchoolOnboard] = useState<any>(null);

    const fetchSchoolOnboard = async () => {
        try {
            const response: any = await getSchoolOnboardById(id as string);
            setSchoolOnboard(response.data);
        } catch (error) {
            console.error("Error fetching school onboard data:", error);
        }
    }

    useEffect(() => {
        fetchSchoolOnboard();
    }, [id]);

    const onReturn = () => {
        navigate(-1);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Schools Onboard", path: "/lookups/school-onboard" },
        { label: "View School Onboard", path: "" },
    ];

    if (!schoolOnboard) {
        return <div className="container mx-auto p-4 lg:p-6">Loading...</div>;
    }

    const { schoolId, schoolCode, dbName, mongoUri, systemKey, username, plainPassword } = schoolOnboard;
    const { 
        name, 
        code, 
        establishmentYear, 
        type, 
        educationLevel, 
        boardAffiliation, 
        principalName, 
        address, 
        contact, 
        facilities,
        branchDetails,
        imageUrl
    } = schoolId;

    return (
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">School Onboard</h3>
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
                        onClick={onReturn}
                    >
                        <TbArrowBackUp size={18} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* School Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                    <h1 className="text-2xl font-bold text-white">School Name : {name}</h1>
                  
               
                </div>

                <div className="p-6">
                    {/* Images Section - Only show if images exist */}
                    {imageUrl && imageUrl.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <TbPhoto className="mr-2 text-blue-600" />
                                School Photos
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imageUrl.map((img: string, index: number) => (
                                    <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                        <img 
                                            src={`${BaseUrl}${img}`} 
                                            alt={`${name} ${index + 1}`} 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {/* <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                                                Image {index + 1}
                                            </span> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* School Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <TbSchool className="mr-2 text-blue-600" />
                                School Information
                            </h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Code:</span> {code}</p>
                                <p><span className="font-medium">School Code:</span> {schoolCode}</p>
                                <p><span className="font-medium">Established:</span> {establishmentYear}</p>
                                <p><span className="font-medium">Board:</span> {boardAffiliation}</p>
                                <p><span className="font-medium">Level:</span> {educationLevel}</p>
                                <p><span className="font-medium">Type:</span> {type}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <TbMapPin className="mr-2 text-green-600" />
                                Address
                            </h3>
                            <div className="space-y-2">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state}</p>
                                <p>{address.country} - {address.postalCode}</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <TbUser className="mr-2 text-purple-600" />
                                Principal & Contact
                            </h3>
                            <div className="space-y-2">
                                <p className="flex items-center">
                                    <TbUser className="mr-2" />
                                    <span className="font-medium">Principal:</span> {principalName}
                                </p>
                                <p className="flex items-center">
                                    <TbPhone className="mr-2" />
                                    <span className="font-medium">Phone:</span> {contact.phone}
                                </p>
                                <p className="flex items-center">
                                    <TbMail className="mr-2" />
                                    <span className="font-medium">Email:</span> {contact.email}
                                </p>
                                <p className="flex items-center">
                                    <TbWorld className="mr-2" />
                                    <span className="font-medium">Website:</span> 
                                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                        {contact.website}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <TbBuilding className="mr-2 text-orange-600" />
                            Facilities
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className={`p-3 rounded-lg flex items-center ${facilities.library ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <TbBook className="mr-2" />
                                Library
                            </div>
                            <div className={`p-3 rounded-lg flex items-center ${facilities.lab ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <TbFlask className="mr-2" />
                                Laboratory
                            </div>
                            <div className={`p-3 rounded-lg flex items-center ${facilities.sports ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <TbSportBillard className="mr-2" />
                                Sports
                            </div>
                            <div className={`p-3 rounded-lg flex items-center ${facilities.transport ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <TbBus className="mr-2" />
                                Transport
                            </div>
                            <div className={`p-3 rounded-lg flex items-center ${facilities.hostel ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <TbHome className="mr-2" />
                                Hostel
                            </div>
                        </div>
                    </div>

                    {/* Branches */}
                    {branchDetails && branchDetails.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <TbSchool className="mr-2 text-blue-600" />
                                Branch Details
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branchDetails.map((branch: any, index: number) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-2 text-sm text-gray-700">{branch.name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{branch.code}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                    {branch.address[0].street}, {branch.address[0].city}, {branch.address[0].state}, {branch.address[0].country} - {branch.address[0].postalCode}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Onboarding Details */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <TbCalendar className="mr-2 text-indigo-600" />
                            Onboarding Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Database Information</h4>
                                <div className="space-y-2">
                                    <p><span className="font-medium">DB Name:</span> {dbName}</p>
                                    <p><span className="font-medium">Mongo URI:</span> {mongoUri}</p>
                                    <p><span className="font-medium">System Key:</span> {systemKey}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Admin Credentials</h4>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Username:</span> {username}</p>
                                    <p><span className="font-medium">Password:</span> {plainPassword}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewSchoolOnBoard;