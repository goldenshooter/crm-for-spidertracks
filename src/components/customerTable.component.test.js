/* eslint-disable testing-library/no-node-access */
import CustomerTable from "./customerTable";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Should test CustomerTable", () => {
  const mockProps = {
    customerForLoadingSales: {
      id: "customer_id",
      name: "customer_name",
      status: 1,
      phone: "customer_phone",
      email: "customer_email",
      created_at: "15-08-2022",
    },
    setCustomerForLoadingSales: jest.fn(),
    setSaleList: jest.fn(),
  };
  test("Should render CustomerTable properly by default", () => {
    render(<CustomerTable {...mockProps} />);

    const container = screen.getByTestId("customer-table-container");
    expect(container).toBeInTheDocument();

    const customerTable = screen.getByTestId("customer-table-table");
    expect(customerTable).toBeInTheDocument();

    const buttonNew = screen.getByTestId("customer-table-table-button-new");
    expect(buttonNew).toBeInTheDocument();
  });

  test("Should open modal when new button clicked", () => {
    render(<CustomerTable {...mockProps} />);

    const buttonNew = screen.getByTestId("customer-table-table-button-new");
    expect(buttonNew).toBeInTheDocument();
    userEvent.click(buttonNew);

    const modal = document.querySelector(".ant-modal-content");
    expect(modal).toBeInTheDocument();
  });
});
