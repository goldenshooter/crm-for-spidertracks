
  export function displayCustomerStatus(customerStatus: number): string {
    let result = "";
    switch (customerStatus) {
      case 0:
        result = "Active";
        break;
      case 1:
        result = "Non-Active";
        break;
      case 2:
        result = "Lead";
        break;
    }
    return result;
  }

  export function displaySaleStatus(saleDetails: number): string {
    let result = "";
    switch (saleDetails) {
      case 0:
        result = "New";
        break;
      case 1:
        result = "Closed Won";
        break;
      case 2:
        result = "Closed Lost";
        break;
    }
    return result;
  }