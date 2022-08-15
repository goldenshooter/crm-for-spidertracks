import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import CustomerTable from "./customerTable";
import SalesTable from "./salesTable";
import { CustomerType, SalesOpportunityType } from "./types";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [getItem("Customer", "1", <UserOutlined />)];

const Homepage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [customerForLoadingSales, setCustomerForLoadingSales] =
    useState<CustomerType>({});
  const [saleList, setSaleList] = useState<Array<SalesOpportunityType>>([]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "16px" }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <CustomerTable
              customerForLoadingSales={customerForLoadingSales}
              setCustomerForLoadingSales={setCustomerForLoadingSales}
              setSaleList={setSaleList}
            />
            <br />
            <SalesTable
              customerForLoadingSales={customerForLoadingSales}
              saleList={saleList}
              setSaleList={setSaleList}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Homepage;
