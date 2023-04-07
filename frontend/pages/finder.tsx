import AppLayout from "@/components/AppLayout";
import FinderForm from "@/components/FinderForm";
import { Space, Typography } from "antd";

export default function ShowFinder() {
  return (
    <AppLayout>
      <Space direction="vertical" style={{width: "100%"}} size="large">
        <Typography.Title>Show Finder</Typography.Title>
        <FinderForm />
      </Space>
    </AppLayout>
  );
}
