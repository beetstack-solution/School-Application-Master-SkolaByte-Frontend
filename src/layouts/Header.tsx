import React, { useEffect, useState } from "react";
import { FaRegUser, FaUserCheck, FaCog, FaBell } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { MdEmail, MdDashboard } from "react-icons/md";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/slices/adminSlice";
import { fetchuserById, SingleUserDataResponse, UserData } from "@/api/admin-api/base-api/userApi";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiExpressionless, BsSun, BsMoon, BsCloudSun } from "react-icons/bs";
import { FiMaximize, FiMinimize, FiSettings } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

const Header: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<SingleUserDataResponse>();
  const [greeting, setGreeting] = useState('Good Morning!');
  const [greetingIcon, setGreetingIcon] = useState(<BsSun className="text-yellow-500" />);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotfDropdown, setShowNotfDropdown] = useState(false);
  const [showAdmDropdown, setShowAdmDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Fix: Properly access the user data from Redux store
  const currentUser = useSelector((state: any) => state.user?.currentSchoolAdmin);
  
  // Fix: Better user data handling with fallbacks
  const userEmail = currentUser?.email || currentUser?.user?.email || 'admin@skolabyte.com';
  const userName = currentUser?.name || currentUser?.user?.name || currentUser?.username || 'Admin User';
  const userRole = currentUser?.role || 'Administrator';

  const handleLogoutConfirm = () => {
    dispatch(signOutSuccess());
    navigate("/login");
  };

  // Fix: Add useEffect to fetch user data if not available in Redux
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.id) {
          const userData = await fetchuserById(currentUser.id);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!currentUser?.email || !currentUser?.name) {
      fetchUserData();
    }
  }, [currentUser]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning!');
      setGreetingIcon(<BsSun className="text-yellow-500" />);
    } else if (hour < 18) {
      setGreeting('Good Afternoon!');
      setGreetingIcon(<BsCloudSun className="text-orange-500" />);
    } else {
      setGreeting('Good Evening!');
      setGreetingIcon(<BsMoon className="text-indigo-400" />);
    }
  }, []);

  // Dropdown handlers
  const toggleDropdown = () => {
    setShowNotfDropdown((prev) => !prev);
    setShowAdmDropdown(false);
    if (!showNotfDropdown) {
      setNotificationCount(0); // Clear notifications when opened
    }
  };

  const toggleAdmDropdown = () => {
    setShowAdmDropdown((prev) => !prev);
    setShowNotfDropdown(false);
  };

  // Click outside handlers
  const handleClickOutside = (e: any) => {
    if (!e.target.closest(".dropdown-container")) {
      setShowNotfDropdown(false);
    }
  };

  const handleClickAdmOutside = (e: any) => {
    if (!e.target.closest(".dropdown-adm-container")) {
      setShowAdmDropdown(false);
    }
  };

  useEffect(() => {
    if (showNotfDropdown) {
      setShowAdmDropdown(false);
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    if (showAdmDropdown) {
      setShowNotfDropdown(false);
      window.addEventListener("click", handleClickAdmOutside);
    } else {
      window.removeEventListener("click", handleClickAdmOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("click", handleClickAdmOutside);
    };
  }, [showNotfDropdown, showAdmDropdown]);

  const handleOpenLogout = () => {
    setShowAdmDropdown(false);
    setShowConfirm(true);
  };

  // Sample notifications
  const notifications = [
    { id: 1, text: "New student registration pending", time: "5 min ago", unread: true },
    { id: 2, text: "Attendance report generated", time: "1 hour ago", unread: true },
    { id: 3, text: "System backup completed", time: "2 hours ago", unread: true },
    { id: 4, text: "Fee payment reminder", time: "1 day ago", unread: false }
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-white via-blue-50 to-white mx-4 my-3 p-6 rounded-2xl shadow-lg border border-blue-100/50 relative backdrop-blur-sm">
        {/* Left side - Greeting and Status */}
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center space-x-4">
            {/* Greeting Card */}
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="text-xl animate-pulse">
                  {greetingIcon}
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-700">
                    {greeting}
                  </h1>
                  <p className="text-xs text-gray-500">Welcome back, {userName}!</p>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-2">
              {/* Network Status */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-blue-50 rounded-xl transition-all duration-300 group border border-gray-200"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <FiMinimize size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <FiMaximize size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Actions and Profile */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-4 z-50">
          {/* Notification Bell */}
          <div className="relative dropdown-container">
            <button
              onClick={toggleDropdown}
              className="relative p-2 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
            >
              <div className="relative">
                <IoIosNotificationsOutline
                  size={24}
                  className="text-gray-600 group-hover:text-blue-600 transition-colors"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </div>
            </button>

            {showNotfDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl animate-fade-in-down z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {notifications.filter(n => n.unread).length} new
                    </span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-1">{notification.text}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="relative dropdown-adm-container">
            <button
              onClick={toggleAdmDropdown}
              className="flex items-center space-x-3 group bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <RiAdminLine size={18} />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full w-3 h-3"></span>
              </div>
              
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{userEmail}</p>
              </div>
              
              <div className="transform group-hover:rotate-180 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showAdmDropdown && (
  <>
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
      onClick={() => setShowAdmDropdown(false)}
    />
    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl z-50 animate-fade-in-down">
      {/* Profile Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <RiAdminLine size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{userName}</p>
            <p className="text-sm text-gray-600 truncate">{userEmail}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link to="/dashboard">
          <div 
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
            onClick={() => setShowAdmDropdown(false)}
          >
            <MdDashboard className="text-gray-500 group-hover:text-blue-600 transition-colors" size={18} />
            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Dashboard</span>
          </div>
        </Link>

        <Link to="/profile">
          <div 
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
            onClick={() => setShowAdmDropdown(false)}
          >
            <FaUserCheck className="text-gray-500 group-hover:text-blue-600 transition-colors" size={16} />
            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Profile</span>
          </div>
        </Link>

        <Link to="/settings">
          <div 
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
            onClick={() => setShowAdmDropdown(false)}
          >
            <FiSettings className="text-gray-500 group-hover:text-blue-600 transition-colors" size={16} />
            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Settings</span>
          </div>
        </Link>

        <hr className="my-2 border-gray-200" />

        <div 
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50/50 transition-colors cursor-pointer group"
          onClick={() => {
            setShowAdmDropdown(false);
            handleOpenLogout();
          }}
        >
          <LuLogOut className="text-gray-500 group-hover:text-red-600 transition-colors" size={16} />
          <span className="text-gray-700 group-hover:text-red-600 transition-colors">Logout</span>
        </div>
      </div>
    </div>
  </>
)}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center animate-pulse">
                  <BsEmojiExpressionless className="text-red-500 text-3xl" />
                </div>
                <div className="absolute inset-0 border-4 border-red-200 rounded-full animate-ping"></div>
              </div>
              
              {/* Text Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Ready to leave?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to log out of your account?
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;