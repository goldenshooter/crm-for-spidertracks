import { Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { firebaseDatabase } from "../firebase/index";
import { setDoc, collection, doc, updateDoc } from "firebase/firestore/lite";
import { CustomerType } from "./types";

interface AddEditCustomerProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  customerDetails: CustomerType;
  setCustomerDetails: (customer: object) => void;
  addSingleCustomer: (customer: CustomerType) => void;
  updateSingleCustomer: (customer: CustomerType) => void;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function AddEditCustomer({
  modalVisible,
  setModalVisible,
  customerDetails,
  setCustomerDetails,
  addSingleCustomer,
  updateSingleCustomer,
}: AddEditCustomerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveDisabled, setSaveDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!Boolean(customerDetails.name)) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    }
  }, [customerDetails.name]);

  const fieldOnChange = (name: string, value: any) => {
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const onCancel = () => {
    setCustomerDetails({});
    setModalVisible(false);
  };

  const onSave = async () => {
    setLoading(true);
    if (!!customerDetails.id) {
      // update customer.
      const customerRef = doc(firebaseDatabase, "customer", customerDetails.id);
      // @ts-ignore
      updateDoc(customerRef, customerDetails)
        .then(() => {
          message.success("Update success");
          updateSingleCustomer(customerDetails);
          setModalVisible(false);
        })
        .catch((err) => {
          message.error("Update failed");
          console.error(err);
        });
      setLoading(false);
    } else {
      // add customer.
      const newRef = doc(collection(firebaseDatabase, "customer"));
      const newDate = new Date();
      const newCustomer: CustomerType = {
        ...customerDetails,
        id: newRef.id,
        created_at: newDate.toLocaleDateString(),
      };
      setDoc(newRef, newCustomer)
        .then(() => {
          message.success("Create success");
          addSingleCustomer(newCustomer);
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
      title="Customer details"
      visible={modalVisible}
      onOk={onSave}
      okButtonProps={{ disabled: saveDisabled, loading: loading }}
      onCancel={onCancel}
    >
      <Form {...layout} name="customer-details" onFinish={onSave}>
        <Form.Item label="ID">
          <Input disabled value={customerDetails.id} />
        </Form.Item>
        <Form.Item label="Name" required>
          <Input
            value={customerDetails.name}
            onChange={(e) => fieldOnChange("name", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Select
            placeholder="Select a status"
            allowClear
            value={customerDetails.status}
            onChange={(value) => fieldOnChange("status", value)}
          >
            <Option value={0}>Active</Option>
            <Option value={1}>Non-Active</Option>
            <Option value={2}>Lead</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Phone">
          <Input
            value={customerDetails.phone}
            onChange={(e) => fieldOnChange("phone", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            value={customerDetails.email}
            onChange={(e) => fieldOnChange("email", e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditCustomer;
