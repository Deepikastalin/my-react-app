import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateActivity } from './components/redux/employeeSlice'; // updated
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/Table/InvoiceForm';
import CustomerManagement from './components/CustomerManagement';
import ProductManagement from './components/ProductManagement';
import Reports from './components/Reports';
import Footer from './components/Footer';
import Login from './components/Login';
import './styles/styles.css';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, lastActivity } = useSelector((state) => state.employee);
  const [activeMenu, setActiveMenu] = useState('Invoice');

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && lastActivity) {
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        const maxInactivity = 15 * 60 * 1000;
        if (inactiveTime > maxInactivity) {
          dispatch(logout());
          alert('Session expired. Please log in again.');
        }
      }
    }, 60000);

    const handleActivity = () => {
      if (isAuthenticated) dispatch(updateActivity());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [dispatch, isAuthenticated, lastActivity]);

  return (
    <BrowserRouter>
      <div className="app-container">
        {isAuthenticated && <Header />}
        <div className="main-content">
          {isAuthenticated && (
            <Sidebar onSelectMenu={setActiveMenu} selectedMenu={activeMenu} />
          )}
          <div className="content-area">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/invoice" element={isAuthenticated ? <InvoiceForm /> : <Navigate to="/login" />} />
              <Route path="/customers" element={isAuthenticated ? <CustomerManagement /> : <Navigate to="/login" />} />
              <Route path="/products" element={isAuthenticated ? <ProductManagement /> : <Navigate to="/login" />} />
              <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to={isAuthenticated ? '/invoice' : '/login'} />} />
            </Routes>
          </div>
        </div>
        {isAuthenticated && <Footer />}
      </div>
    </BrowserRouter>
  );
};

export default App;
