import React, { useState } from "react";
import { FiHome, FiUser, FiShoppingCart, FiFileText, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onSelectMenu, selectedMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'Reports', label: 'Home', icon: <FiHome />, path: '/reports' },
    { id: 'Invoice', label: 'Invoice', icon: <FiFileText />, path: '/invoice' },
    { id: 'Products', label: 'Products', icon: <FiShoppingCart />, path: '/products' },
    { id: 'Customers', label: 'Customers', icon: <FiUser />, path: '/customers' },
    { id: 'Settings', label: 'Settings', icon: <FiSettings />, path: '/settings' }
  ];

  const handleMenuClick = (menuItem) => {
    onSelectMenu(menuItem.id);
    navigate(menuItem.path);
  };

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle" 
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-menu-item ${selectedMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item)}
            title={collapsed ? item.label : ''}
          >
            <span className="menu-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;