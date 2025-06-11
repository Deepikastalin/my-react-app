import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from './itemsSlice';

const ItemList = () => {
  const items = useSelector((state) => state.items.items);
  const dispatch = useDispatch();
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() !== '') {
      dispatch(addItem(newItem));
      setNewItem('');
    }
  };

  // Inline styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    fontFamily: 'Arial, sans-serif',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
    width: '300px',
  };

  const listItemStyle = {
    backgroundColor: '#f0f0f0',
    margin: '6px 0',
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center',
  };

  const inputStyle = {
    padding: '8px',
    width: '200px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <ul style={listStyle}>
        {items.map((item, index) => (
          <li key={index} style={listItemStyle}>{item}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item"
          style={inputStyle}
        />
        <button onClick={handleAdd} style={buttonStyle}>Add Item</button>
      </div>
    </div>
  );
};

export default ItemList;
