import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductInputRow from "./ProductInputRow";
import CustomerInputRow from "./CustomerInputRow";
import ProductTable from "./ProductTable";
import InvoiceSummary from "./InvoiceSummary";
import Sidebar from "../Sidebar";

import { fetchAllProducts, fetchProductById } from "../redux/productslice";
import { fetchAllCustomers } from "../redux/customerSlice";

import {
  addOrUpdateInvoiceItem,
  removeInvoiceItem,
  updateInvoiceItem,
  setCustomerInfo,
  submitInvoiceAsync,
} from "../redux/InvoiceSlice";

const InvoiceForm = () => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.invoice.invoiceItems || []);
  const customerInfo = useSelector((state) => state.invoice.customerInfo || {});
  const submitStatus = useSelector((state) => state.invoice.status);
  const submitError = useSelector((state) => state.invoice.error);

  const productList = useSelector((state) => state.product.list || []);
  const productLoading = useSelector((state) => state.product.loading);

  const customerList = useSelector((state) => state.customer.list || []);

  const [selectedProduct, setSelectedProduct] = useState({
    productId: "",
    qty: "1",
    productName: "",
    price: 0,
    taxPercent: 0,
  });

  const [editAt, setEditAt] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("Invoice");

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  // ✅ Fixed: Set correct keys from customer dropdown
  const handleCustomerSelect = (customer) => {
    dispatch(
      setCustomerInfo({
        customerId: customer.customerId,
        customerName: customer.customerName,
        mobileNumber: customer.mobileNumber,
        customerLocation: customer.customerLocation,
      })
    );
  };

  const fetchProductDetailsFromRedux = async (productId) => {
    let product = productList.find((p) => p.productId === productId);
    if (product) return product;
    try {
      const resultAction = await dispatch(fetchProductById(productId));
      if (fetchProductById.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        alert(resultAction.payload || "Failed to fetch product");
        return null;
      }
    } catch {
      alert("Failed to fetch product");
      return null;
    }
  };

  const handleProductSelect = async (productId) => {
    const product = await fetchProductDetailsFromRedux(productId);
    if (!product) return;

    if (product.stockQuantity <= 0) {
      alert("Product is out of stock.");
      return;
    }

    setSelectedProduct({
      productId: product.productId,
      qty: "1",
      productName: product.name,
      price: product.price,
      taxPercent: product.taxPercent,
    });
  };

  const handleAddOrUpdate = () => {
    const { productId, qty } = selectedProduct;
    const product = productList.find((p) => p.productId === productId);
    const quantity = parseInt(qty, 10);

    if (!product || isNaN(quantity) || quantity <= 0) {
      alert("Select a valid product and quantity.");
      return;
    }

    if (quantity > product.stockQuantity) {
      alert("Insufficient stock.");
      return;
    }

    if (editAt !== null) {
      dispatch(
        updateInvoiceItem({
          index: editAt,
          quantity,
          price: product.price,
        })
      );
      setEditAt(null);
    } else {
      dispatch(
        addOrUpdateInvoiceItem({
          productId,
          productName: product.name,
          quantity,
          price: product.price,
          taxPercent: product.taxPercent,
        })
      );
    }

    setSelectedProduct({
      productId: "",
      qty: "1",
      productName: "",
      price: 0,
      taxPercent: 0,
    });
  };

  const handleEdit = async (index) => {
    const item = items[index];
    const product = await fetchProductDetailsFromRedux(item.productId);
    if (!product) return;

    setSelectedProduct({
      productId: item.productId,
      productName: item.productName,
      qty: item.quantity.toString(),
      price: item.price,
      taxPercent: item.taxPercent,
    });
    setEditAt(index);
  };

  const handleDelete = (index) => {
    dispatch(removeInvoiceItem(index));
    if (editAt === index) {
      setEditAt(null);
      setSelectedProduct({
        productId: "",
        qty: "1",
        productName: "",
        price: 0,
        taxPercent: 0,
      });
    }
  };

  const handleUpdateItem = (index, newQty, newPrice) => {
    const quantity = parseInt(newQty, 10);
    const price = parseFloat(newPrice);
    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
      alert("Please enter valid quantity and price");
      return;
    }
    dispatch(updateInvoiceItem({ index, quantity, price }));
  };

  const handleProceed = () => {
    if (items.length === 0) {
      alert("Please add at least one product to the invoice");
      return;
    }
    if (!customerInfo.customerId) {
      alert("Please select a customer");
      return;
    }
    dispatch(submitInvoiceAsync())
      .unwrap()
      .then(() => alert("Invoice submitted successfully!"))
      .catch((err) => alert("Error submitting invoice: " + err));
  };

  return (
    <div className="app-container">
      <Sidebar onSelectMenu={setSelectedMenu} selectedMenu={selectedMenu} />

      <div className="main-content">
        <div className="content-area">
          <div className="invoice-container">
            <h1 className="heading">Invoice Form</h1>

            <div className="customer-info">
              <h3>Customer Information</h3>
              <CustomerInputRow
                customerData={customerInfo}
                onChange={handleCustomerSelect}
                customerOptions={customerList}
              />
            </div>

            <ProductInputRow
              productData={selectedProduct}
              onChange={setSelectedProduct}
              onProductIdBlur={() => {}}
              onProductSelect={handleProductSelect}
              onAddOrUpdate={handleAddOrUpdate}
              isEditMode={editAt !== null}
              productOptions={productList}
              loading={productLoading}
            />

            <ProductTable
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateItem={handleUpdateItem}
            />

            <InvoiceSummary items={items} />

            <div className="action-buttons">
              <button
                className="proceed-button"
                onClick={handleProceed}
                disabled={submitStatus === "loading"}
              >
                {submitStatus === "loading"
                  ? "Submitting..."
                  : "Proceed & Generate Invoice"}
              </button>
            </div>

            {submitError && <p className="error-message">Error: {submitError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
