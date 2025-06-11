import React, { useState, useEffect, useRef } from "react";

const CustomerInputRow = ({ customerData, onChange, customerOptions }) => {
  const [inputValue, setInputValue] = useState(customerData.customerName || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(customerData.customerName || "");
  }, [customerData.customerName]);

  useEffect(() => {
    const val = inputValue.trim().toLowerCase();
    if (!val) {
      setFilteredOptions([]);
      return;
    }

    const filtered = customerOptions.filter((cust) => {
      const name = String(cust.customerName || "").toLowerCase();
      const phone = String(cust.mobileNumber || "").toLowerCase();
      return name.includes(val) || phone.includes(val);
    });

    setFilteredOptions(filtered);
  }, [inputValue, customerOptions]);

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
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleSelectSuggestion = (cust) => {
    const updated = {
      customerId: cust.customerId,
      customerName: cust.customerName,
      mobileNumber: cust.mobileNumber,
      customerLocation: cust.customerLocation,
    };

    setInputValue(cust.customerName);
    onChange(updated);
    setTimeout(() => setShowSuggestions(false), 100);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
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
          placeholder="Enter customer name or phone"
          autoComplete="off"
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <ul className="suggestions-list">
            {filteredOptions.map((cust, idx) => (
              <li
                key={cust.customerId}
                className={`suggestion-item ${idx === activeIndex ? "active" : ""}`}
                onClick={() => handleSelectSuggestion(cust)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {cust.customerName} - {cust.mobileNumber}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        className="product-input"
        value={customerData.mobileNumber || ""}
        placeholder="Phone"
        readOnly
      />

      <input
        type="text"
        className="product-input"
        value={customerData.customerLocation || ""}
        placeholder="Location"
        readOnly
      />
    </div>
  );
};

export default CustomerInputRow;
