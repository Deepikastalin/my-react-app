import React from "react";

const InvoiceSummary = ({ items }) => {
  const totalWithoutTax = items.reduce((a, i) => a + i.total, 0);
  const totalTax = items.reduce((a, i) => a + i.taxAmount, 0);

  const roundedSubtotal = parseFloat(totalWithoutTax.toFixed(2));
  const roundedTax = parseFloat(totalTax.toFixed(2));
  const grandTotal = (roundedSubtotal + roundedTax).toFixed(2);

  return (
    <div className="invoice-summary">
      <div>Subtotal: ₹{roundedSubtotal.toFixed(2)}</div>
      <div>Tax: ₹{roundedTax.toFixed(2)}</div>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        Grand Total: ₹{grandTotal}
      </div>
    </div>
  );
};

export default InvoiceSummary;
