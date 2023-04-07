import useSWR from "swr";

import { Donghua } from "@prisma/client";
import { Form, Space } from "antd";

export default function FinderForm() {

  const {data, error, isLoading} = useSWR<Donghua[]>("/api/search");

  return (
    <Space direction="vertical" size="middle">
      <Form>Form here</Form>
    </Space>
  );
}
