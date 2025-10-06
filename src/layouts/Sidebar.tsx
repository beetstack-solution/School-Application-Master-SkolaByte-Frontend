import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import {
  FaExpand,
  FaBars,
  FaAngleDown,
  FaUsers,
  FaUserLock,
  FaUserTie,
  FaMoneyCheck,
  FaClipboardList,
} from "react-icons/fa";
import { VscFileSubmodule, VscSymbolMethod } from "react-icons/vsc";
import schooAppLogo from "@/assets/images/edu.jpg";
import { RiAdminLine } from "react-icons/ri";
import {
  MdAttachMoney,
  MdCoPresent,
  MdEvent,
  MdNotificationAdd,
  MdOutlineAdminPanelSettings,
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineEmojiTransportation,
  MdOutlineEventRepeat,
  MdOutlineGrade,
} from "react-icons/md";
import { GoOrganization } from "react-icons/go";
import {
  GiBookshelf,
  GiCalendarHalfYear,
  GiPayMoney,
  GiReceiveMoney,
  GiTeacher,
  GiWhiteBook,
} from "react-icons/gi";
import {
  SiBookstack,
  SiGoogleclassroom,
  SiPrivatedivision,
} from "react-icons/si";
import { PiExamFill, PiStudent } from "react-icons/pi";
import { HiAcademicCap, HiOutlineCalendar } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid, LiaVoteYeaSolid } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdBookmarks,
} from "react-icons/io";
import { IoBookSharp, IoBusSharp, IoCloseSharp, IoSchoolSharp } from "react-icons/io5";
import { FaLocationDot, FaSquarePollVertical } from "react-icons/fa6";
import { CiShoppingTag } from "react-icons/ci";
import { TbBellSchool, TbPigMoney, TbReport, TbReportSearch } from "react-icons/tb";
import { TiThMenuOutline } from "react-icons/ti";
import { BiBusSchool, BiSolidBusSchool } from "react-icons/bi";
import { LuSchool } from "react-icons/lu";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDefaultSettingsOpen, setIsDefaultSettingsOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isMasterSettingsOpen, setIsMasterSettingsOpen] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [isSubmenuSettingsOpen, setIsSubmenuSettingsOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLookupsOpen, setIsLookupsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isStudentManagement, setisStudentManagement] = useState(false);
  const [isTeacherManagement, setisTeacherManagement] = useState(false);
  const [isFinancialManagement, setIsFinancialManagement] = useState(false);
  const [isLibraryManagement, setIsLibraryManagement] = useState(false);
  const [isTransportManagement, setIsTransportManagement] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isAcademicSettingsOpen, setIsAcademicSettings] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Track screen width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  // Update the window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen((prev) => {
      if (prev && windowWidth <= 768) {
        setIsSubmenuOpen(false);
        setActiveMenu(null);
      }
      return !prev;
    });
  };

  const toggleMenu = (menu: string) => {
    if (!isOpen) setIsOpen(true);
    
    setActiveMenu(activeMenu === menu ? null : menu);
    
    // Set individual menu states
    switch (menu) {
      case 'school':
        setIsSchoolOpen(!isSchoolOpen);
        break;
      case 'certificate':
        setIsCertificateOpen(!isCertificateOpen);
        break;
      default:
        break;
    }
  };

  // Automatically collapse sidebar on mobile screen
  useEffect(() => {
    if (windowWidth <= 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [windowWidth]);

  // Menu items data for better organization
  const menuItems = [
    {
      id: 'dashboard',
      path: '/',
      icon: FiHome,
      label: 'Dashboard',
      type: 'single'
    },
    {
      id: 'school',
      icon: LuSchool,
      label: 'School Master',
      type: 'dropdown',
      items: [
        { path: '/lookups/schools', icon: IoSchoolSharp, label: 'School' },
        { path: '/lookups/school-onboard', icon: TbBellSchool, label: 'School on board' },
        { path: '/lookups/pta-role', icon: TbBellSchool, label: 'P.T.A Role' },
      ]
    },
    {
      id: 'certificate',
      icon: IoMdBookmarks,
      label: 'Certificate',
      type: 'dropdown',
      items: [
        { path: '/lookups/template-type', icon: IoSchoolSharp, label: 'Template Type' },
        { path: '/lookups/paper-size', icon: TbBellSchool, label: 'Paper Size' },
        { path: '/certificate-template', icon: TbBellSchool, label: 'Certificate Template Management' },
      ]
    }
  ];

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 via-blue-900 to-gray-800 text-white h-screen flex flex-col transition-all duration-500 ease-in-out shadow-2xl relative ${
        isOpen ? "w-72" : "w-20"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 p-4 border-b border-white/10">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isOpen ? "px-2" : "px-0"
        }`}>
          {/* Logo and Brand */}
          <div className={`flex items-center space-x-3 transition-all duration-300 ${
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}>
            <div className="relative">
              <img
                src={schooAppLogo}
                alt="School App"
                className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Skola Byte
              </h2>
              <p className="text-xs text-blue-200/80">School Management</p>
            </div>
          </div>

          {/* Collapsed Logo */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            !isOpen ? "opacity-100" : "opacity-0"
          }`}>
            <img
              src={schooAppLogo}
              alt="School App"
              className="w-10 h-10 rounded-xl border-2 border-white/20"
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          >
            {isOpen ? (
              <IoIosArrowBack className="text-white text-lg" />
            ) : (
              <IoIosArrowForward className="text-white text-lg" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-blue-900/20 py-4 relative z-10">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.type === 'single' && item.path ? (
                <Link to={item.path}>
                  <div
                    className={`group flex items-center p-3 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
                        : "hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10"
                    }`}
                  >
                    {/* Active indicator */}
                    {location.pathname === item.path && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`relative transition-transform duration-300 group-hover:scale-110 ${
                      location.pathname === item.path ? "text-white" : "text-blue-200"
                    }`}>
                      <item.icon className="text-xl" />
                    </div>
                    
                    {/* Label */}
                    {isOpen && (
                      <span className={`ml-4 font-medium transition-all duration-300 ${
                        location.pathname === item.path ? "text-white" : "text-gray-200 group-hover:text-white"
                      }`}>
                        {item.label}
                      </span>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </Link>
              ) : (
                <>
                  {/* Dropdown Header */}
                  <div
                    className={`group flex items-center p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                      activeMenu === item.id
                        ? "bg-white/10 shadow-lg shadow-blue-500/10"
                        : "hover:bg-white/5"
                    }`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    {/* Icon */}
                    <div className={`relative transition-transform duration-300 ${
                      activeMenu === item.id ? "text-blue-300 scale-110" : "text-gray-300 group-hover:text-blue-200"
                    }`}>
                      <item.icon className="text-xl" />
                    </div>
                    
                    {/* Label and Arrow */}
                    {isOpen && (
                      <div className="flex items-center justify-between flex-1 ml-4">
                        <span className={`font-medium transition-colors duration-300 ${
                          activeMenu === item.id ? "text-white" : "text-gray-200 group-hover:text-white"
                        }`}>
                          {item.label}
                        </span>
                        <FaAngleDown
                          className={`transition-transform duration-300 ${
                            activeMenu === item.id ? "rotate-180 text-blue-300" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Dropdown Items */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activeMenu === item.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="ml-2 space-y-1 py-2 border-l-2 border-white/10">
                      {item.items?.map((subItem, index) => (
                        <li key={subItem.path}>
                          <Link to={subItem.path}>
                            <div
                              className={`group flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer relative ${
                                location.pathname === subItem.path
                                  ? "bg-blue-500/20 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-400 before:rounded-r"
                                  : "hover:bg-white/5 hover:text-white"
                              }`}
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              {/* Sub-item Icon */}
                              <div className={`transition-transform duration-300 group-hover:scale-110 ${
                                location.pathname === subItem.path ? "text-blue-300" : "text-gray-400 group-hover:text-blue-200"
                              }`}>
                                <subItem.icon className="text-lg" />
                              </div>
                              
                              {/* Sub-item Label */}
                              {isOpen && (
                                <span className="ml-3 text-sm font-medium transition-all duration-300">
                                  {subItem.label}
                                </span>
                              )}

                              {/* Hover glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Actions Section */}
        {isOpen && (
          <div className="mt-8 px-3">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 group">
                  <MdNotificationAdd className="text-blue-300 group-hover:text-blue-200 text-lg" />
                  <span className="ml-2 text-sm text-white">New Announcement</span>
                </button>
                <button className="w-full flex items-center p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 group">
                  <PiStudent className="text-green-300 group-hover:text-green-200 text-lg" />
                  <span className="ml-2 text-sm text-white">Add Student</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10 relative z-10">
        {isOpen ? (
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <RiAdminLine className="text-white text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-blue-200/80 truncate">Administrator</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <RiAdminLine className="text-white text-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thumb-blue-600\/50::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-track-blue-900\/20::-webkit-scrollbar-track {
          background-color: rgba(30, 58, 138, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;