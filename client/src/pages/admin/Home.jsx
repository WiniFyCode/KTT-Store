import React from "react";
import { FaHome, FaUsers, FaBox, FaTags, FaChartBar, FaCog } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";

const Home = () => {
   return (
      <div className="min-h-screen bg-gray-100">
         {/* Navbar */}
         <nav className="bg-white shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">
               <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
               <div className="flex items-center space-x-4">
                  <button className="relative">
                     <MdNotifications className="text-2xl text-gray-600 hover:text-gray-800" />
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        3
                     </span>
                  </button>
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        A
                     </div>
                     <span className="text-gray-700">Admin</span>
                  </div>
               </div>
            </div>
         </nav>

         {/* Main Content */}
         <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Dashboard Cards */}
               <DashboardCard
                  icon={<FaUsers className="text-blue-500" />}
                  title="Người dùng"
                  value="1,234"
                  bgColor="bg-blue-100"
               />
               <DashboardCard
                  icon={<FaBox className="text-green-500" />}
                  title="Sản phẩm"
                  value="567"
                  bgColor="bg-green-100"
               />
               <DashboardCard
                  icon={<FaTags className="text-yellow-500" />}
                  title="Đơn hàng"
                  value="89"
                  bgColor="bg-yellow-100"
               />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
               <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <QuickActionButton
                     icon={<FaUsers />}
                     text="Quản lý người dùng"
                  />
                  <QuickActionButton
                     icon={<FaBox />}
                     text="Quản lý sản phẩm"
                  />
                  <QuickActionButton
                     icon={<FaChartBar />}
                     text="Thống kê"
                  />
                  <QuickActionButton
                     icon={<FaCog />}
                     text="Cài đặt"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

// Component Card thống kê
const DashboardCard = ({ icon, title, value, bgColor }) => {
   return (
      <div className={`${bgColor} rounded-lg p-6 shadow-sm transition-transform hover:scale-105`}>
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-gray-600 text-sm">{title}</h3>
               <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="text-3xl">{icon}</div>
         </div>
      </div>
   );
};

// Component nút thao tác nhanh
const QuickActionButton = ({ icon, text }) => {
   return (
      <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
         <span className="text-2xl text-gray-600 mb-2">{icon}</span>
         <span className="text-sm text-gray-700">{text}</span>
      </button>
   );
};

export default Home;