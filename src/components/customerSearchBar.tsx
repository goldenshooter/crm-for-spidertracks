import { Space, Input, Select, Button } from "antd";
import React, { useState } from "react";
import { firebaseDatabase } from "../firebase/index";
import { getDocs, collection, query, where } from "firebase/firestore/lite";
import { CustomerType } from "./types";

interface SearchBarProps {
  setCustomerList: (customerList: Array<CustomerType>) => void;
  setCustomerForLoadingSales: (customer: CustomerType) => void;
}

const { Option } = Select;

function CustomerSearchBar({
  setCustomerList,
  setCustomerForLoadingSales,
}: SearchBarProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerStatus, setCustomerStatus] = useState<number | undefined>();
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");

  const onSearch = () => {
    setLoading(true);
    const constraints = [];
    if (customerName) {
      constraints.push(where("name", "==", customerName));
    }
    if (customerStatus || customerStatus === 0) {
      constraints.push(where("status", "==", customerStatus));
    }
    if (customerPhone) {
      constraints.push(where("phone", "==", customerPhone));
    }
    if (customerEmail) {
      constraints.push(where("email", "==", customerEmail));
    }
    console.log(constraints);
    const salesQuery = query(
      collection(firebaseDatabase, "customer"),
      ...constraints
    );
    getDocs(salesQuery).then((querySnapshot) => {
      const customerList = querySnapshot.docs.map((doc) =>
        Object.assign({}, { id: doc.id, ...doc.data() })
      );
      setCustomerList(customerList);
      setCustomerForLoadingSales({});
      setLoading(false);
    });
  };

  const onReset = () => {
    setCustomerName("");
    setCustomerStatus(undefined);
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerForLoadingSales({});
    setLoading(true);
    const customerCollection = collection(firebaseDatabase, "customer");
    getDocs(customerCollection).then((customersSnapshot) => {
      const customerList = customersSnapshot.docs.map((doc) =>
        Object.assign({}, { id: doc.id, ...doc.data() })
      );
      setCustomerList(customerList);
      setLoading(false);
    });
  };

  return (
    <Space size="large" align="end">
      <Space direction="vertical" align="start">
        <span>Name</span>
        <Input
          allowClear
          data-testid="customer-search-bar-name-input"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </Space>

      <Space direction="vertical" align="start">
        <span>Status</span>
        <Select
          placeholder="Select a status"
          data-testid="customer-search-bar-status-select"
          allowClear
          value={customerStatus}
          onChange={(value) => setCustomerStatus(value)}
          style={{ width: "130px" }}
        >
          <Option value={0}>Active</Option>
          <Option value={1}>Non-Active</Option>
          <Option value={2}>Lead</Option>
        </Select>
      </Space>

      <Space direction="vertical" align="start">
        <span>Phone</span>
        <Input
          allowClear
          data-testid="customer-search-bar-phone-input"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </Space>

      <Space direction="vertical" align="start">
        <span>Email</span>
        <Input
          allowClear
          data-testid="customer-search-bar-email-input"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
      </Space>

      <Button data-testid="customer-search-bar-search-button" type="primary" onClick={onSearch} loading={loading}>
        Serach
      </Button>

      <Button data-testid="customer-search-bar-reset-button" onClick={onReset}>
        Reset
      </Button>
    </Space>
  );
}

export default CustomerSearchBar;
