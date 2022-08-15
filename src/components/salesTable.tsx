import { Button, message, Modal, Space, Table, Typography } from "antd";
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
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore/lite";
import AddEditSales from "./addEditSale";
import { CustomerType, SalesOpportunityType } from "./types";

interface SalesTableProps {
  customerForLoadingSales: CustomerType;
  saleList: Array<SalesOpportunityType>;
  setSaleList: (saleList: Array<SalesOpportunityType>) => void;
}

const { Title } = Typography;
const { confirm } = Modal;

function SalesTable({
  customerForLoadingSales,
  saleList,
  setSaleList,
}: SalesTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [saleDetails, setSaleDetails] = useState<SalesOpportunityType>({});

  const readSales = () => {
    if (customerForLoadingSales.id) {
      setLoading(true);
      const salesCollection = collection(firebaseDatabase, "sales_opportunity");
      const salesQuery = query(
        salesCollection,
        where("customer_id", "==", customerForLoadingSales.id)
      );

      getDocs(salesQuery).then((querySnapshot) => {
        let sales = querySnapshot.docs.map((doc) =>
          Object.assign({}, { id: doc.id, ...doc.data() })
        );
        console.log(sales);
        setSaleList(sales);
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerForLoadingSales.id) {
      readSales();
    } else {
      setSaleList([]);
    }
  }, [customerForLoadingSales.id]);

  function editOnClick(saleDetails: SalesOpportunityType) {
    setSaleDetails(saleDetails);
    setModalVisible(true);
  }

  function deleteOnClick(saleDetails: SalesOpportunityType) {
    setSaleDetails(saleDetails);
    confirm({
      title: "Are you sure delete this?",
      icon: <ExclamationCircleOutlined />,
      content: saleDetails.name,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (saleDetails.id) {
          deleteDoc(doc(firebaseDatabase, "sales_opportunity", saleDetails.id))
            .then(() => {
              message.success("delete success");
              setSaleList(
                saleList.filter((eachSale) => eachSale.id !== saleDetails.id)
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

  function newOnClick() {
    setSaleDetails({ customer_id: customerForLoadingSales.id });
    setModalVisible(true);
  }

  function displayStatus(saleDetails: number): string {
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

  function updateSingleSale(saleDetails: SalesOpportunityType) {
    setSaleList(
      saleList.map((eachSale) => {
        if (eachSale.id === saleDetails.id) {
          return saleDetails;
        }
        return eachSale;
      })
    );
  }

  function addSingleSale(saleDetails: SalesOpportunityType) {
    setSaleList([...saleList, saleDetails]);
  }

  const columns: ColumnsType<SalesOpportunityType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => displayStatus(text),
    },
    {
      title: "Action",
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
    <>
      <Table
        columns={columns}
        dataSource={saleList}
        loading={loading}
        rowKey={(record) => record.id || ""}
        title={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={5}>Sales for {customerForLoadingSales.name}</Title>
            <Button type="primary" onClick={() => newOnClick()}>
              New
            </Button>
          </div>
        )}
      />
      <AddEditSales
        customerId={customerForLoadingSales.id}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        saleDetails={saleDetails}
        setSaleDetails={setSaleDetails}
        addSingleSale={addSingleSale}
        updateSingleSale={updateSingleSale}
      />
    </>
  );
}

export default SalesTable;
