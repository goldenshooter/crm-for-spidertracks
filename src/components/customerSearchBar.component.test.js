import CustomerSearchBar from "./customerSearchBar";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("renders welcome message", () => {
  render(<CustomerSearchBar />);
  expect(screen.getByText("Name")).toBeInTheDocument();
});

describe("Should test CustomerSearchBar", () => {
  const mockProps = {
    setCustomerList: jest.fn(),
    setCustomerForLoadingSales: jest.fn(),
  };
  test("Should render CustomerSearchBar properly by default", () => {
    render(<CustomerSearchBar {...mockProps} />);

    const nameLabel = screen.getByText("Name");
    expect(nameLabel).toBeInTheDocument();
    const nameInput = screen.getByTestId("customer-search-bar-name-input");
    expect(nameInput).toBeInTheDocument();

    const statusLabel = screen.getByText("Status");
    expect(statusLabel).toBeInTheDocument();
    const statusSelect = screen.getByTestId(
      "customer-search-bar-status-select"
    );
    expect(statusSelect).toBeInTheDocument();

    const phoneLabel = screen.getByText("Phone");
    expect(phoneLabel).toBeInTheDocument();
    const phoneInput = screen.getByTestId("customer-search-bar-phone-input");
    expect(phoneInput).toBeInTheDocument();

    const emailLabel = screen.getByText("Email");
    expect(emailLabel).toBeInTheDocument();
    const emailInput = screen.getByTestId("customer-search-bar-email-input");
    expect(emailInput).toBeInTheDocument();

    const searchButton = screen.getByTestId(
      "customer-search-bar-search-button"
    );
    expect(searchButton).toBeInTheDocument();

    const resetButton = screen.getByTestId("customer-search-bar-reset-button");
    expect(resetButton).toBeInTheDocument();
  });

  test("Should reset all fields when reset button clicks", () => {
    render(<CustomerSearchBar {...mockProps} />);

    let nameInput = screen.getByTestId("customer-search-bar-name-input");
    userEvent.type(nameInput, 'Chao')
    expect(nameInput.value).toBe('Chao');

    let phoneInput = screen.getByTestId("customer-search-bar-phone-input");
    userEvent.type(phoneInput, '1234567890')
    expect(phoneInput.value).toBe('1234567890');

    let emailInput = screen.getByTestId("customer-search-bar-email-input");
    userEvent.type(emailInput, 'steven.zhang@gmail.com')
    expect(emailInput.value).toBe('steven.zhang@gmail.com');

    const resetButton = screen.getByTestId("customer-search-bar-reset-button");
    userEvent.click(resetButton);

    nameInput = screen.getByTestId("customer-search-bar-name-input");
    phoneInput = screen.getByTestId("customer-search-bar-phone-input");
    emailInput = screen.getByTestId("customer-search-bar-email-input");
    expect(nameInput.value).toBe('');
    expect(phoneInput.value).toBe('');
    expect(emailInput.value).toBe('');
  });
});
