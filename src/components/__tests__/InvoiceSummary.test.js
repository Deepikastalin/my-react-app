// __tests__/InvoiceSummary.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import InvoiceSummary from "../Table/InvoiceSummary";

describe("InvoiceSummary Component", () => {
  it("renders correctly with no items", () => {
    render(<InvoiceSummary items={[]} />);
    expect(screen.getByText(/subtotal:/i)).toHaveTextContent("₹0.00");
    expect(screen.getByText(/tax:/i)).toHaveTextContent("₹0.00");
    expect(screen.getByText(/grand total:/i)).toHaveTextContent("₹0.00");
  });

  it("calculates totals correctly", () => {
    const items = [
      { total: 100, taxAmount: 18 },
      { total: 50, taxAmount: 9 },
    ];

    render(<InvoiceSummary items={items} />);
    expect(screen.getByText(/subtotal:/i)).toHaveTextContent("₹150.00");
    expect(screen.getByText(/tax:/i)).toHaveTextContent("₹27.00");
    expect(screen.getByText(/grand total:/i)).toHaveTextContent("₹177.00");
  });

  it("formats numbers to two decimal places", () => {
    const items = [
      { total: 99.999, taxAmount: 18.456 },
    ];

    render(<InvoiceSummary items={items} />);
    expect(screen.getByText(/subtotal:/i)).toHaveTextContent("₹100.00");
    expect(screen.getByText(/tax:/i)).toHaveTextContent("₹18.46");
    expect(screen.getByText(/grand total:/i)).toHaveTextContent("₹118.46");
  });
});
