import React, { useState } from "react";

const ProductTable = ({ items, onDelete, onUpdateItem }) => {
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEditStart = (productId, field, value) => {
    setEditingId(productId);
    setEditField(field);
    setEditValue(value);
  };

  const handleEditEnd = (index) => {
    if (editField === "quantity") {
      onUpdateItem(index, editValue, items[index].price);
    } else if (editField === "price") {
      onUpdateItem(index, items[index].quantity, editValue);
    }
    setEditingId(null);
    setEditField(null);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      handleEditEnd(index);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditField(null);
    }
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Tax %</th>
          <th>Tax Amount</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan="8" className="empty-table">No products added</td>
          </tr>
        ) : (
          items.map((item, index) => (
            <tr key={`${item.productId}-${index}`}>
              <td>{item.productId}</td>
              <td>{item.productName}</td>
              <td 
                className="editable-cell"
                onClick={() => handleEditStart(item.productId, "quantity", item.quantity)}
              >
                {editingId === item.productId && editField === "quantity" ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBlur={() => handleEditEnd(index)}
                    autoFocus
                    min="1"
                    step="1"
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td 
                className="editable-cell"
                onClick={() => handleEditStart(item.productId, "price", item.price)}
              >
                {editingId === item.productId && editField === "price" ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBlur={() => handleEditEnd(index)}
                    autoFocus
                    min="0"
                    step="0.01"
                  />
                ) : (
                  `₹${item.price.toFixed(2)}`
                )}
              </td>
              <td>{item.taxPercent}%</td>
              <td>₹{item.taxAmount.toFixed(2)}</td>
              <td>₹{item.total.toFixed(2)}</td>
              <td>
                <button 
                  className="btn delete-button" 
                  onClick={() => onDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;