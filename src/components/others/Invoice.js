// import React, { useState } from "react";
// import axios from "axios";
// import "./Style.css";

// const InvoiceForm = () => {
//   const [product_id, setProductId] = useState("");
//   const [productName, setProductName] = useState("");
//   const [price, setPrice] = useState("");
//   const [tax, setTax] = useState("");
//   const [stockQty, setStockQty] = useState("");
//   const [qty, setQty] = useState("1");
//   const [items, setItems] = useState([]);
//   const [editAt, setEditAt] = useState(null);

//   const totalWithoutTax = items.reduce((a, i) => a + i.total, 0);
//   const totalTax = items.reduce((a, i) => a + i.taxAmount, 0);
//   const finalAmount = totalWithoutTax + totalTax;

//   const fetchProductDetails = async () => {
//     if (!product_id || product_id.length === 0) return;

//     try {
//       const resp = await axios.get(`http://localhost:8080/api/products/${product_id}`);
//       const { name, price, taxPercent, stockQuantity } = resp.data;

//       if (stockQuantity <= 0) {
//         alert("Out of stock");
//         setProductName(""); setPrice(""); setTax(""); setStockQty("");
//         return;
//       }

//       setProductName(name);
//       setPrice(price);
//       setTax(taxPercent);
//       setStockQty(stockQuantity);

//     } catch (err) {
//       console.log("Error fetching product:", err);
//       alert("Invalid product ID");
//       setProductName(""); setPrice(""); setTax(""); setStockQty("");
//     }
//   };

//   const addItem = () => {
//     if (!productName || !price || !qty) return;

//     let q = parseInt(qty);
//     let pr = parseFloat(price);
//     let tx = parseFloat(tax);

//     if (q > stockQty) {
//       alert("Insufficient stock");
//       return;
//     }

//     let tot = pr * q;
//     let taxAmount = (tot * tx) / 100;

//     let itemObj = {
//       productId: product_id,
//       productName,
//       quantity: q,
//       price: pr,
//       total: tot,
//       taxPercent: tx,
//       taxAmount: taxAmount
//     };
// // avoid duplicate
//     let idx = items.findIndex(el => el.productId === product_id);

//     if (editAt !== null) {
//       let newList = [...items];
//       newList[editAt] = itemObj;
//       setItems(newList);
//       setEditAt(null);
//     } else if (idx !== -1) {
//       let existing = items[idx];
//       let newQty = existing.quantity + q;

//       if (newQty > stockQty) {
//         alert("Stock exceeded");
//         return;
//       }

//       let newTotal = pr * newQty;
//       let newTax = (newTotal * tx) / 100;

//       let updatedItem = {
//         ...existing,
//         quantity: newQty,
//         total: newTotal,
//         taxAmount: newTax
//       };

//       let newList = [...items];
//       newList[idx] = updatedItem;
//       setItems(newList);
//     } else {
//       setItems(prev => [...prev, itemObj]);
//     }

//     // Reset inputs
//     setProductId(""); setProductName(""); setPrice("");
//     setTax(""); setStockQty(""); setQty("");
//   };

//   const editItem = (i) => {
//     const obj = items[i];
//     setProductId(obj.productId);
//     setProductName(obj.productName);
//     setPrice(obj.price);
//     setTax(obj.taxPercent);
//     setQty(obj.quantity);
//     setEditAt(i);
//     fetchProductDetails(); // To double-check if still in stock
//   };

//   const deleteItem = (i) => {
//     let tmp = items.filter((_, index) => index !== i);
//     setItems(tmp);
//   };

//   return (
//     <div className="invoice-container">
//       <h2>Invoice Form</h2>

//       <div className="input-row">
//         <input
//           type="number"
//           placeholder="Product ID"
//           value={product_id}
//           onChange={(e) => setProductId(e.target.value)}
//           onBlur={fetchProductDetails}
//           className="product-input"
//         />

//         <input
//           type="text"
//           placeholder="Product Name"
//           value={productName}
//           readOnly
//           className="product-input"
//         />

//         <input
//           type="number"
//           placeholder="Qty"
//           value={qty}
//           onChange={(e) => setQty(e.target.value)}
//           className="product-input"
//         />

//         <input
//           type="number"
//           placeholder="Price"
//           value={price}
//           readOnly
//           className="product-input"
//         />

//         <input
//           type="number"
//           placeholder="Tax %"
//           value={tax}
//           readOnly
//           className="product-input"
//         />

//         <button onClick={addItem} className="add-button">
//           {editAt !== null ? "Update" : "Add"}
//         </button>
//       </div>

//       <table className="product-table">
//         <thead>
//           <tr>
//             <th>ID</th><th>Name</th><th>Qty</th><th>Price</th>
//             <th>Tax%</th><th>Total</th><th>Tax</th><th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.length ? items.map((obj, i) => (
//             <tr key={i}>
//               <td>{obj.productId}</td>
//               <td>{obj.productName}</td>
//               <td>{obj.quantity}</td>
//               <td>{obj.price.toFixed(2)}</td>
//               <td>{obj.taxPercent}%</td>
//               <td>{obj.total.toFixed(2)}</td>
//               <td>{obj.taxAmount.toFixed(2)}</td>
//               <td>
//                 <button onClick={() => editItem(i)} className="edit-button">Edit</button>
//                 <button onClick={() => deleteItem(i)} className="delete-button">Delete</button>
//               </td>
//             </tr>
//           )) : (
//             <tr>
//               <td colSpan="8">Nothing added yet.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="invoice-summary">
//         <p><strong>Subtotal:</strong> ₹{totalWithoutTax.toFixed(2)}</p>
//         <p><strong>Tax:</strong> ₹{totalTax.toFixed(2)}</p>
//         <p><strong>Total:</strong> ₹{finalAmount.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// export default InvoiceForm;
