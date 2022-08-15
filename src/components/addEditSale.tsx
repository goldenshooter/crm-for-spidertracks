import { Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { firebaseDatabase } from "../firebase/index";
import {
  setDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore/lite";
import { SalesOpportunityType } from "./types";

interface AddEditSaleProps {
  customerId: string | undefined;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  saleDetails: SalesOpportunityType;
  setSaleDetails: (saleDetails: object) => void;
  addSingleSale: (saleDetails: SalesOpportunityType) => void;
  updateSingleSale: (saleDetails: SalesOpportunityType) => void;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function AddEditSale({
  customerId,
  modalVisible,
  setModalVisible,
  saleDetails,
  setSaleDetails,
  addSingleSale,
  updateSingleSale,
}: AddEditSaleProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveDisabled, setSaveDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!Boolean(saleDetails.name)) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    }
  }, [saleDetails.name]);

  const fieldOnChange = (name: string, value: any) => {
    setSaleDetails({ ...saleDetails, [name]: value });
  };

  const onCancel = () => {
    setSaleDetails({});
    setModalVisible(false);
  };

  const onSave = () => {
    setLoading(true);
    if (!!saleDetails.id) {
      // update sale.
      const saleRef = doc(
        firebaseDatabase,
        "sales_opportunity",
        saleDetails.id
      );
      // @ts-ignore
      updateDoc(saleRef, saleDetails)
        .then(() => {
          message.success("Update success");
          updateSingleSale(saleDetails);
          setModalVisible(false);
        })
        .catch((err) => {
          message.error("Update failed");
          console.error(err);
        });
      setLoading(false);
    } else {
      // add sale.
      const newRef = doc(collection(firebaseDatabase, "sales_opportunity"));
      const newSale = {
        ...saleDetails,
        id: newRef.id,
        customer_id: customerId,
      };
      setDoc(newRef, newSale)
        .then(() => {
          message.success("Create success");
          addSingleSale(newSale);
          setModalVisible(false);
        })
        .catch((err) => {
          message.success("Create failed");
          console.error(err);
        });
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sale opporitunity"
      visible={modalVisible}
      onOk={onSave}
      okButtonProps={{ disabled: saveDisabled, loading: loading }}
      onCancel={onCancel}
    >
      <Form {...layout} name="sale-details" onFinish={onSave}>
        <Form.Item label="Name" required>
          <Input
            value={saleDetails.name}
            onChange={(e) => fieldOnChange("name", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Select
            placeholder="Select a status"
            allowClear
            value={saleDetails.status}
            onChange={(value) => fieldOnChange("status", value)}
          >
            <Option value={0}>New</Option>
            <Option value={1}>Closed Won</Option>
            <Option value={2}>Closed Lost</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditSale;
