import React, { useEffect, useState } from "react";
import MiniCalendar from "@/components/MiniCalendar";
import { toast } from "react-toastify";
import { fetchStudents } from "@/api/admin-api/student-management/students-api/studentsApi";
import { fetchTeachers } from "@/api/admin-api/lookups-api/teachersApi";
import { EventData, fetchEvents } from "@/api/admin-api/lookups-api/eventApi";
import { fetchExams, ExamData } from "@/api/admin-api/lookups-api/examApi";
import { motion, useMotionValue, useTransform, animate, easeOut, easeInOut } from "framer-motion";
import { PiStudentDuotone, PiChalkboardTeacherLight, PiExam, PiCalendarBlank } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { TbSchool, TbCalendarEvent } from "react-icons/tb";
import { FaUsers, FaChartLine, FaSchool } from "react-icons/fa";
import { MdOutlineEventNote, MdOutlineDashboard } from "react-icons/md";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    y: -5,
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const glowVariants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
};

const Dashboard: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [events, setEvents] = useState<EventData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [upcomingEvent, setUpcomingEvent] = useState<EventData | null>(null);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [students, setStudents] = useState<any[]>([]);
  
  // Create motion values for animations
  const studentCount = useMotionValue(0);
  const teacherCount = useMotionValue(0);
  const roundedStudents = useTransform(studentCount, Math.round);
  const roundedTeachers = useTransform(teacherCount, Math.round);
  
  const page = 0;
  const limit = 0;

  const fetchAllStudents = async () => {
    const response = await fetchStudents();
    setTotalStudents(response.total);
    animate(studentCount, response.total, { duration: 2 });
  };

  const fetchAllTeachers = async () => {
    const allTeachers = await fetchTeachers(page, limit, ""); 
    setTotalTeachers(allTeachers.total);
    animate(teacherCount, allTeachers.total, { duration: 2 });
  };

  const fetchAllExams = async () => {
    const response = await fetchExams(page, limit);
    const exams = response?.data?.data || [];
    setExams(exams);
  };

  const fetchAllEvents = async () => {
    const response = await fetchEvents();
    const sortedEvents = [...response.eventList].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sortedEvents);
    setUpcomingEvent(sortedEvents[0] || null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllStudents(),
          fetchAllTeachers(),
          fetchAllEvents(),
          fetchAllExams(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load required data");
      }
    };

    fetchData();
  }, []);

  // Stats cards data
  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: PiStudentDuotone,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      delay: 0.1
    },
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: LiaChalkboardTeacherSolid,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      delay: 0.2
    },
    {
      title: "Upcoming Exams",
      value: exams.length,
      icon: PiExam,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      delay: 0.3
    },
    {
      title: "Events This Month",
      value: events.length,
      icon: TbCalendarEvent,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-xl">
            <MdOutlineDashboard className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Welcome to your school management dashboard</p>
      </motion.div>

      {/* Welcome Banner */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl mb-8"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8">
          <div className="text-white max-w-2xl mb-6 lg:mb-0">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Your Dashboard!
            </motion.h2>
            <motion.p 
              className="text-blue-100 text-lg leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Let go of the stress and enjoy a smoother way to manage your school. 
              Everything you need to run your institution efficiently is right here.
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-2 text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">System Online</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">All Services Active</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <img
              src="https://pub-59b2359efd8b4a47a5f0f73005d2a16c.r2.dev/itsme/uploads/homeBanner/1745413615066-output-onlinegiftools%20%281%29.gif"
              alt="Dashboard Animation"
              className="w-48 h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
            />
            {/* Floating elements around the image */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full shadow-lg"
              animate={{ 
                y: [0, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: stat.delay }}
            className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 group"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`}></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`text-2xl ${stat.textColor}`} />
                </div>
                <motion.div
                  className="text-2xl font-bold text-gray-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: stat.delay + 0.5, type: "spring" }}
                >
                  {stat.title === "Total Students" ? (
                    <motion.span>{roundedStudents}</motion.span>
                  ) : stat.title === "Total Teachers" ? (
                    <motion.span>{roundedTeachers}</motion.span>
                  ) : (
                    stat.value
                  )}
                </motion.div>
              </div>
              
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: stat.delay + 0.8, duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calendar and Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Calendar Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <PiCalendarBlank className="text-2xl text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">Academic Calendar</h3>
              </div>
            </div>
            <div className="p-6">
              <MiniCalendar />
            </div>
          </motion.div>

          {/* Quick Stats Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TbCalendarEvent className="text-2xl text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                        {event.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Exams */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <PiExam className="text-2xl text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Exams</h3>
              </div>
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-orange-700 transition-colors">
                        {exam.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exam.className} • {exam.subjectName}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - System Status and Quick Actions */}
        <div className="space-y-8">
          {/* System Status */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaChartLine className="text-2xl text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">System Status</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Student Management", status: "active", color: "bg-green-400" },
                { name: "Teacher Portal", status: "active", color: "bg-green-400" },
                { name: "Finance System", status: "active", color: "bg-green-400" },
                { name: "Library Management", status: "active", color: "bg-green-400" },
              ].map((system, index) => (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-700">{system.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${system.color} animate-pulse`}></div>
                    <span className="text-sm text-gray-600 capitalize">{system.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Add Student", icon: PiStudentDuotone, color: "bg-white/20" },
                { name: "Add Teacher", icon: LiaChalkboardTeacherSolid, color: "bg-white/20" },
                { name: "Schedule", icon: TbCalendarEvent, color: "bg-white/20" },
                { name: "Reports", icon: FaChartLine, color: "bg-white/20" },
              ].map((action, index) => (
                <motion.button
                  key={action.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl ${action.color} backdrop-blur-sm hover:bg-white/30 transition-all duration-300 space-y-2`}
                >
                  <action.icon className="text-2xl" />
                  <span className="text-sm font-medium text-center">{action.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;