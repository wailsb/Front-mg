import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaLayerGroup, 
  FaUsers, 
  FaClipboardList, 
  FaChartLine,
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaQuestionCircle,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useSite } from '../contexts/SiteContext';
import { dashboardAPI } from '../utils/api';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { siteName } = useSite();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (siteName) document.title = siteName;
  }, [siteName]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Define sidebar menu items
  const menuItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBoxes size={20} />, label: 'Products' },
    { path: '/admin/categories', icon: <FaLayerGroup size={20} />, label: 'Categories' },
    { path: '/admin/users', icon: <FaUsers size={20} />, label: 'Users' },
    { path: '/admin/orders', icon: <FaClipboardList size={20} />, label: 'Orders' },
    { path: '/admin/statistics', icon: <FaChartLine size={20} />, label: 'Statistics' },
    { path: '/admin/pending-approvals', icon: <FaUserShield size={20} />, label: 'Admin Approvals' },
    { path: '/admin/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
        // You may need to implement this endpoint in your backend
        const response = await dashboardAPI.getNotifications();
        setNotifications(response.data);
      } catch (error) {
        setNotifications([]);
      }
      setNotificationsLoading(false);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-amber-600 text-gray-900 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed overflow-scroll inset-y-0 left-0 z-10 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-white flex items-center">
            <FaUserShield className="mr-2" />
            <span>Admin Panel</span>
          </Link>
        </div>
        <div className="mt-10">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-xl font-semibold">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{currentUser?.name || 'Admin'}</p>
                <p className="text-sm text-gray-400">{currentUser?.email || ''}</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${location.pathname === item.path ? 'bg-amber-600 text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 mt-8 rounded-lg text-amber-500 hover:bg-gray-800 hover:text-amber-400 transition duration-200"
                >
                  <span className="mr-4">
                    <FaSignOutAlt size={20} />
                  </span>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
              </h1>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <div className="relative">
                      <FaBell size={22} />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-gray-900 font-bold">
                          {notifications.length}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div key={notification.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 text-center">
                        <Link to="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Help */}
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  <FaQuestionCircle size={22} />
                </button>
                
                {/* Admin Profile */}
                <div className="relative">
                  <button className="flex items-center text-gray-600 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      {currentUser?.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
