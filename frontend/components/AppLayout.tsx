import { Layout, Menu, Typography } from "antd";
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  // random show
  const randomId = Math.floor(Math.random() * 2000);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ padding: "0 20%" }}>
        <Typography.Title
          style={{
            margin: 0,
            paddingTop: 12,
            marginRight: 48,
            display: "inline",
            float: "left",
          }}
          level={2}
        >
          <Link href={"/"}>Donghua DB</Link>
        </Typography.Title>
        <Menu
          selectable={false}
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: "list",
              label: <Link href="/list">Shows</Link>,
            },
            {
              key: "finder",
              label: <Link href="/finder">Finder</Link>,
            },
            {
              key: "random",
              label: <Link href={`/detail/${randomId}`}>Random</Link>
            }
          ]}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: "0 20%", paddingBottom: "24px" }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
