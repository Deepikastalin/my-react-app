import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEmployees, loginSuccess } from '../components/redux/employeeSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allEmployees, loading, error } = useSelector((state) => state.employee);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalize input
    const trimmedName = name.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Search for employee match
    const employee = allEmployees.find(
      (emp) =>
        emp.empName?.toLowerCase() === trimmedName &&
        emp.phone === trimmedPhone
    );

    if (employee) {
      dispatch(loginSuccess(employee));
      setLoginError('');
      navigate('/invoice'); // redirect to dashboard
    } else {
      setLoginError('Employee not found. Please check your name and phone number.');console.log(allEmployees);
    }
    
  };

  return (
    <div className="login-container">
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;