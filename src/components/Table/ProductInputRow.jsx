import React, { useState, useEffect, useRef } from "react";
import { FiSave, FiPlus } from 'react-icons/fi';

const ProductInputRow = ({
  productData,
  onChange,
  onProductSelect,
  onAddOrUpdate,
  isEditMode,
  productOptions
}) => {
  const [inputValue, setInputValue] = useState(String(productData.productId || ""));
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(String(productData.productId || ""));
  }, [productData.productId]);

  useEffect(() => {
    const val = inputValue.trim().toLowerCase();
    if (!val) {
      setFilteredOptions([]);
      return;
    }

    const filtered = (productOptions || []).filter(opt => {
      const pid = String(opt.productId || "").toLowerCase();
      const name = String(opt.name || "").toLowerCase();
      return pid.includes(val) || name.includes(val);
    });

    setFilteredOptions(filtered);
  }, [inputValue, productOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(true);
    setActiveIndex(-1);
    onChange({ ...productData, productId: val });
  };

  const handleQtyChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      onChange({ ...productData, qty: val });
    }
  };

  const handleSelectSuggestion = (opt) => {
    const updated = {
      productId: opt.productId,
      productName: opt.name,
      price: opt.price,
      taxPercent: opt.taxPercent,
      qty: productData.qty || "1"
    };

    setInputValue(String(opt.productId));
    onChange(updated);
    setTimeout(() => setShowSuggestions(false), 100);
    setActiveIndex(-1);
    
    if (onProductSelect) {
      onProductSelect(opt.productId);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleSelectSuggestion(filteredOptions[activeIndex]);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="input-row" ref={wrapperRef}>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          className="autocomplete-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter product ID or name"
          autoComplete="off"
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <ul className="suggestions-list">
            {filteredOptions.map((opt, idx) => (
              <li
                key={opt.productId}
                className={`suggestion-item ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelectSuggestion(opt)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {opt.productId} - {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        className="product-input"
        value={productData.productName || ""}
        placeholder="Product Name"
        readOnly
      />

      <input
        type="text"
        className="product-input"
        value={productData.price != null ? productData.price : ""}
        placeholder="Price"
        readOnly
      />

      <input
        type="text"
        className="product-input"
        value={productData.qty}
        onChange={handleQtyChange}
        placeholder="Qty"
      />

      <input
        type="text"
        className="product-input"
        value={productData.taxPercent != null ? productData.taxPercent : ""}
        placeholder="Tax %"
        readOnly
      />

      <button className="add-button" onClick={onAddOrUpdate}>
        {isEditMode ? (
          <>
            <FiSave /> Update
          </>
        ) : (
          <>
            <FiPlus /> Add Product
          </>
        )}
      </button>
    </div>
  );
};

export default ProductInputRow;