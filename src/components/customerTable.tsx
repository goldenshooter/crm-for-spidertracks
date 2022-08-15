import { Button, Modal, Space, Table, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import {
  EditTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { firebaseDatabase } from "../firebase/index";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  where,
  query,
} from "firebase/firestore/lite";
import AddEditCustomer from "./addEditCustomer";
import { CustomerType, SalesOpportunityType } from "./types";
import CustomerSearchBar from "./customerSearchBar";
import { displayCustomerStatus } from "./helperFunctions";

interface CustomerTableProps {
  customerForLoadingSales: CustomerType;
  setCustomerForLoadingSales: (customer: CustomerType) => void;
  setSaleList: (saleList: Array<SalesOpportunityType>) => void;
}

interface DataType {
  id: string;
  key: string;
  name: string;
  status: number;
  phone: string;
  email: string;
  created_at: any;
}

const { Title } = Typography;
const { confirm } = Modal;

function CustomerTable({
  customerForLoadingSales,
  setCustomerForLoadingSales,
  setSaleList,
}: CustomerTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerType>({});
  const [customerList, setCustomerList] = useState<Array<any>>([]);

  const readCustomer = () => {
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

  useEffect(() => {
    readCustomer();
  }, []);

  function editOnClick(customer: CustomerType) {
    setCustomerDetails(customer);
    setModalVisible(true);
  }

  function newOnClick() {
    setCustomerDetails({});
    setModalVisible(true);
  }

  function deleteOnClick(customer: CustomerType) {
    setCustomerDetails(customer);

    confirm({
      title: `Are you sure delete ${customer.name} and related sales data?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (customer.id) {
          deleteDoc(doc(firebaseDatabase, "customer", customer.id))
            .then(() => {
              const SalesQuery = query(
                collection(firebaseDatabase, "sales_opportunity"),
                where("customer_id", "==", customer.id)
              );
              getDocs(SalesQuery).then((querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                  deleteDoc(doc.ref);
                });
                message.success("delete success");
              });

              setCustomerList(
                customerList.filter(
                  (eachCustomer) => eachCustomer.id !== customer.id
                )
              );
              // @ts-ignore
              setSaleList((prevState) =>
                prevState.filter(
                  // @ts-ignore
                  (eachSale) => eachSale.customer_id !== customer.id
                )
              );
            })
            .catch((err) => {
              console.error(err);
              message.error("delete failed");
            });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  function updateSingleCustomer(customer: CustomerType) {
    setCustomerList(
      customerList.map((eachCustomer) => {
        if (eachCustomer.id === customer.id) {
          return customer;
        }
        return eachCustomer;
      })
    );
  }

  function addSingleCustomer(customer: CustomerType) {
    setCustomerList([...customerList, customer]);
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setCustomerForLoadingSales(record);
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => displayCustomerStatus(text),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="large">
          <EditTwoTone onClick={() => editOnClick(record)} />
          <DeleteTwoTone
            twoToneColor="red"
            onClick={() => deleteOnClick(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Space
      data-testid="customer-table-container"
      direction="vertical"
      style={{ width: "100%" }}
    >
      <CustomerSearchBar
        setCustomerList={setCustomerList}
        setCustomerForLoadingSales={setCustomerForLoadingSales}
      />
      <Table
        columns={columns}
        dataSource={customerList}
        data-testid="customer-table-table"
        loading={loading}
        rowKey={(record) => record.id}
        title={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={5}>Customer</Title>
            <Button
              data-testid="customer-table-table-button-new"
              type="primary"
              onClick={() => newOnClick()}
            >
              New
            </Button>
          </div>
        )}
        rowClassName={(record: CustomerType) => {
          if (record.id === customerForLoadingSales.id) {
            return "row--highlight";
          } else {
            return "";
          }
        }}
      />
      <AddEditCustomer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        customerDetails={customerDetails}
        setCustomerDetails={setCustomerDetails}
        addSingleCustomer={addSingleCustomer}
        updateSingleCustomer={updateSingleCustomer}
      />
    </Space>
  );
}

export default CustomerTable;
