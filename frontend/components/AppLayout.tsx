import { Layout, Typography } from "antd";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  return (
    <Layout>
      <Layout.Header style={{ padding: "0 20%" }}>
        <Typography.Title style={{color: "white", margin: 0, paddingTop: 12}} level={2}>Donghua DB</Typography.Title>
      </Layout.Header>
      <Layout.Content style={{ padding: "0 20%", paddingBottom: "24px" }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
