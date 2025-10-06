import React from 'react';
import { useNavigate } from 'react-router-dom';

function SchoolCodeLogin() {
    const navigate = useNavigate();
    return (
        <div className='flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50'>
            <div className='flex-1 flex flex-col items-center justify-center'>
                <main className='w-full max-w-md p-8 bg-white rounded-xl shadow-lg'>
                    <div className="flex flex-col items-center">
                        {/* School-themed header */}
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-600 p-3 rounded-full mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-blue-800">School Portal</h1>
                        </div>

                        <div className="w-full">
                            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Enter Your School Code</h2>

                            <div className="mb-6">
                                <label
                                    htmlFor="schoolCode"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    School Code
                                </label>
                                <input
                                    type="text"
                                    id="schoolCode"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. SCH12345"
                                />
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                Continue to Login
                            </button>

                            <div className="mt-4 text-center">
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                                    Don't know your school code?
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SchoolCodeLogin;