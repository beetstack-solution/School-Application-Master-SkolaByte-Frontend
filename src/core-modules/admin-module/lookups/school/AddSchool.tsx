import React from 'react';
import Breadcrumb from "@/components/Breadcumb";
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { createSchoolProfile } from '@/api/admin-api/lookups-api/schoolApi';

function AddSchool() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        name: '',
        establishmentYear: '',
        type: '',
        educationLevel: '',
        boardAffiliation: '',
        principalName: '',
        files: [],
        onBoarded: false,
        address: {
            street: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: ''
        },
        contact: {
            phone: '',
            email: '',
            website: ''
        },
        facilities: {
            library: false,
            lab: false,
            sports: false,
            transport: false,
            hostel: false
        },
        branchDetails: [
            {
                name: '',
                code: '',
                address: [
                    {
                        street: '',
                        city: '',
                        state: '',
                        country: 'India',
                        postalCode: ''
                    }
                ]
            }
        ]
    });
console.log("formData", formData)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setFormData((prev:any) => ({
                ...prev,
                files: Array.from(selectedFiles),
            }));
        }
    };
    const handleRemoveNewImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            newImages: prev.files.filter((_, i) => i !== index)
        }));
    };

      
    const handleChange = (e:any) => {
        const { name, value, type, checked } = e.target;

        // Handle nested objects (address, contact, facilities)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            // Handle branchDetails separately
            if (parent === 'branchDetails') {
                const [_, index, field, subfield] = name.split('.');
                setFormData(prev => {
                    const newBranchDetails = [...prev.branchDetails];
                    if (subfield) {
                        // Handle branchDetails[0].address.street etc.
                        newBranchDetails[index] = {
                            ...newBranchDetails[index],
                            address: {
                                ...newBranchDetails[index].address,
                                [subfield]: value
                            }
                        };
                    } else {
                        // Handle branchDetails[0].name etc.
                        newBranchDetails[index] = {
                            ...newBranchDetails[index],
                            [field]: value
                        };
                    }
                    return {
                        ...prev,
                        branchDetails: newBranchDetails
                    };
                });
            } else {
                // Handle other nested objects (address, contact, facilities)
                setFormData((prev:any) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? checked : value
                    }
                }));
            }
        } else {
            // Handle top-level fields
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append basic information
            formDataToSend.append('name', formData.name);
            formDataToSend.append('establishmentYear', formData.establishmentYear);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('educationLevel', formData.educationLevel);
            formDataToSend.append('boardAffiliation', formData.boardAffiliation);
            formDataToSend.append('principalName', formData.principalName);
            formDataToSend.append('onBoarded', formData.onBoarded.toString());

            // Append address
            formDataToSend.append('address[street]', formData.address.street);
            formDataToSend.append('address[city]', formData.address.city);
            formDataToSend.append('address[state]', formData.address.state);
            formDataToSend.append('address[country]', formData.address.country);
            formDataToSend.append('address[postalCode]', formData.address.postalCode);

            // Append contact
            formDataToSend.append('contact[phone]', formData.contact.phone);
            formDataToSend.append('contact[email]', formData.contact.email);
            formDataToSend.append('contact[website]', formData.contact.website);

            // Append facilities
            Object.entries(formData.facilities).forEach(([key, value]) => {
                formDataToSend.append(`facilities[${key}]`, value.toString());
            });

            // Append branch details
            formData.branchDetails.forEach((branch: any, index: number) => {
                formDataToSend.append(`branchDetails[${index}][name]`, branch.name);
                formDataToSend.append(`branchDetails[${index}][code]`, branch.code);

                // Append branch address
                formDataToSend.append(`branchDetails[${index}][address][street]`, branch.address.street);
                formDataToSend.append(`branchDetails[${index}][address][city]`, branch.address.city);
                formDataToSend.append(`branchDetails[${index}][address][state]`, branch.address.state);
                formDataToSend.append(`branchDetails[${index}][address][country]`, branch.address.country);
                formDataToSend.append(`branchDetails[${index}][address][postalCode]`, branch.address.postalCode);
            });

            // Append files
            if (formData.files && formData.files.length > 0) {
                formData.files.forEach((file: File) => {
                    formDataToSend.append('files', file);
                });
            }

            // Send the form data
            const response = await createSchoolProfile(formDataToSend);

            console.log('School created successfully:', response);
            navigate('/lookups/schools');
        } catch (error) {
            console.error('Error creating school:', error);
            // Handle error (show toast/notification)
        }
    };

    const onReturn = () => {
        navigate(-1);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Schools", path: "/lookups/schools" },
        { label: "Add School", path: "" },
    ];

    return (
        <div className="container mx-auto p-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Add School</h3>
                    <div className="breadcrumb-section">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <div className="header-btns">
                    <button
                        type="button"
                        className="add-btn flex items-center"
                        onClick={onReturn}
                    >
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Basic Information</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">School Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Establishment Year</label>
                            <input
                                type="number"
                                name="establishmentYear"
                                value={formData.establishmentYear}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                                <option value="Charter">Charter</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Education Level</label>
                            <select
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select Level</option>
                                <option value="Primary">Primary</option>
                                <option value="Secondary">Secondary</option>
                                <option value="Higher Secondary">Higher Secondary</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Board Affiliation</label>
                            <input
                                type="text"
                                name="boardAffiliation"
                                value={formData.boardAffiliation}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Principal Name</label>
                            <input
                                type="text"
                                name="principalName"
                                value={formData.principalName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* File input for new uploads */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Add More Images</label>
                            <input
                                type="file"
                                name="files"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                JPEG, PNG, JPG (Max 5MB each)
                            </p>
                        </div>
                        {/* Display new uploads preview with delete option */}
                        {formData.files.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">New Uploads</h5>
                                <div className="flex flex-wrap gap-4">
                                    {formData.files.map((file, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Upload preview ${index}`}
                                                className="h-32 w-32 object-cover rounded border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="onBoarded"
                                checked={formData.onBoarded}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">On Boarded</label>
                        </div>  */}
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Address Information</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Street</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                name="address.postalCode"
                                value={formData.address.postalCode}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Contact Information</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="contact.phone"
                                value={formData.contact.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="contact.email"
                                value={formData.contact.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <input
                                type="url"
                                name="contact.website"
                                value={formData.contact.website}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Facilities</h4>
                        <div className="space-y-2">
                            {Object.entries(formData.facilities).map(([facility, value]) => (
                                <div key={facility} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name={`facilities.${facility}`}
                                        checked={value}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700 capitalize">
                                        {facility}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Branch Details */}
                    <div className="space-y-4 md:col-span-2">
                        <h4 className="text-lg font-medium">Branch Details</h4>
                        {formData.branchDetails && formData.branchDetails.map((branch:any, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.name`}
                                            value={branch.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Branch Code</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.code`}
                                            value={branch.code}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <h5 className="text-md font-medium">Branch Address</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Street</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.address.street`}
                                            value={branch.address.street}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.address.city`}
                                            value={branch.address.city}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.address.state`}
                                            value={branch.address.state}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.address.country`}
                                            value={branch.address.country}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                        <input
                                            type="text"
                                            name={`branchDetails.${index}.address.postalCode`}
                                            value={branch.address.postalCode}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onReturn}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save School
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddSchool;