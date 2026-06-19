import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { getNotifications, markNotificationAsRead } from '../../redux/actions';
import NotificationItem from './NotificationItem.jsx';

const NotificationBell = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // // const { notifications, loading } = useSelector(state => state.notifications);
  // const dispatch = useDispatch();
  // const dropdownRef = useRef(null);

  // const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // useEffect(() => {
  //   dispatch(getNotifications());
    
  //   // Set up polling for notifications
  //   const interval = setInterval(() => {
  //     dispatch(getNotifications());
  //   }, 30000); // Poll every 30 seconds
    
  //   return () => clearInterval(interval);
  // }, [dispatch]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const handleNotificationClick = (id) => {
  //   dispatch(markNotificationAsRead(id));
  // };

  return (
    <div className="relative">
      {/* <button 
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={toggleDropdown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
          <div className="py-2 px-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-4 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <NotificationItem 
                  key={notification._id} 
                  notification={notification} 
                  onClick={() => handleNotificationClick(notification._id)}
                />
              ))
            )}
          </div>
          <div className="py-2 px-3 bg-gray-50 border-t border-gray-200 text-center">
            <a href="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
              View all notifications
            </a>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default NotificationBell;