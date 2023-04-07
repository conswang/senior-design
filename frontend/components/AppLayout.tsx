import { Layout } from "antd";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
}

export default function AppLayout({children}: LayoutProps) {
  return <Layout>
    <Layout.Content style={{padding: "0 20%"}}>{children}</Layout.Content>
  </Layout>
}