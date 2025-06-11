import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchAllProducts } from "./redux/productslice"; // Adjusted path
import "../styles/styles.css";

const HomePage = () => {
  const dispatch = useDispatch();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [invoiceCountToday, setInvoiceCountToday] = useState(0);

  const { list: products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    // Fetch employee count
    axios.get("http://localhost:2105/api/employees")
      .then(res => setEmployeeCount(res.data.length || 0))
      .catch(err => console.error("Error fetching employees:", err));

    // // Fetch today's invoices
    // axios.get("http://localhost:8082/api/invoices/today") // Adjust this endpoint based on your backend
    //   .then(res => setInvoiceCountToday(res.data.length || 0))
    //   .catch(err => console.error("Error fetching invoices:", err));

    // Fetch all products
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Derived data
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = [...products]
    .filter(p => p.stock > 0 && p.stock <= 5)
    .slice(0, 3);

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <h2 className="dashboard-heading">Dashboard</h2>

        <div className="card-grid">
          <div className="info-card purple">
            <h3>{invoiceCountToday}</h3>
            <p>Invoices Today</p>
          </div>
          <div className="info-card blue">
            <h3>{employeeCount}</h3>
            <p>Total Employees</p>
          </div>
          <div className="info-card red">
            <h3>{loading ? "..." : outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
          <div className="info-card green">
            <h3>{loading ? "..." : totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        {error && <p className="error-msg">Error: {error}</p>}

       


          <h3>Low Stock Alerts</h3>
          <ul className="recent-list">
            {lowStockProducts.length === 0 && <li>All products are sufficiently stocked.</li>}
            {lowStockProducts.map((p, idx) => (
              <li key={idx}>
                {p.name || `Product ${p.productId}`} — Only {p.stock} left
              </li>
            ))}
          </ul>
        </div>
      </div>
   
  );
};

export default HomePage;
