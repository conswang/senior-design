import { Layout, Menu, Typography } from "antd";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ padding: "0 20%" }}>
        <Typography.Title
          style={{
            color: "white",
            margin: 0,
            paddingTop: 12,
            marginRight: 48,
            display: "inline",
            float: "left",
          }}
          level={2}
        >
          Donghua DB
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          items={new Array(3).fill(null).map((_, index) => ({
            key: String(index + 1),
            label: `nav ${index + 1}`,
          }))}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: "0 20%", paddingBottom: "24px" }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
