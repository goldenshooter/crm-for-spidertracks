import { displayCustomerStatus, displaySaleStatus } from "./helperFunctions";

const MOCK_CUSTOMER_STATUS = [
  {
    input: 0,
    expected: "Active",
  },
  {
    input: 1,
    expected: "Non-Active",
  },
  {
    input: 2,
    expected: "Lead",
  },
  {
    input: 99,
    expected: "",
  },
  {
    input: "abc",
    expected: "",
  },
  {
    input: null,
    expected: "",
  },
  {
    input: undefined,
    expected: "",
  },
];

const MOCK_SALE_STATUS = [
  {
    input: 0,
    expected: "New",
  },
  {
    input: 1,
    expected: "Closed Won",
  },
  {
    input: 2,
    expected: "Closed Lost",
  },
  {
    input: 99,
    expected: "",
  },
  {
    input: "abc",
    expected: "",
  },
  {
    input: null,
    expected: "",
  },
  {
    input: undefined,
    expected: "",
  },
];
describe("Should return correct customer status", () => {
  test.each(MOCK_CUSTOMER_STATUS)(
    "Should test getAvatarInitial function and return first letter of author: %o",
    (data) => {
      const result = displayCustomerStatus(data.input);
      expect(result).toBe(data.expected);
    }
  );

  test.each(MOCK_SALE_STATUS)("Should return correct sale status", (data) => {
    const result = displaySaleStatus(data.input);
    expect(result).toBe(data.expected);
  });
});
