import useSWR from "swr";

import { Donghua } from "@prisma/client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
} from "antd";
import { SearchFilter } from "@/types";
import { useRouter } from "next/router";

export default function FinderForm() {
  // const { data, error, isLoading } = useSWR<Donghua[]>("/api/search");

  // const {mutate} = useSWR<Donghua[]>(`/api/search/q=${query.search}`);

  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (fieldsValue: any) => {
    console.log(fieldsValue);

    let filter: SearchFilter = {
      query: fieldsValue["query"],
      includeNsfw: fieldsValue["include-nsfw"],
    };

    window.location.href = `/list?searchFilter=${JSON.stringify(filter)}`;
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      size="small"
      layout="horizontal"
      style={{ width: "100%" }}
      onFinish={onFinish}
    >
      <Form.Item label="Query" name="query">
        <Input />
      </Form.Item>
      <Form.Item label="Air date" name="air-date">
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item label="Include NSFW" name="include-nsfw">
        <Switch />
      </Form.Item>
      <Form.Item label="Number of episodes">
        <Form.Item
          label="min"
          name="num-episodes-min"
          colon={false}
          style={{ display: "inline-block", marginRight: 12 }}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="max"
          name="num-episodes-max"
          colon={false}
          style={{ display: "inline-block" }}
        >
          <InputNumber />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Platform">
        <Radio.Group>
          <Radio.Button value="tv">TV</Radio.Button>
          <Radio.Button value="web">Web</Radio.Button>
          <Radio.Button value="other">Other</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Score">
        <Form.Item
          label="min"
          name="score-min"
          colon={false}
          style={{ display: "inline-block", marginRight: 12 }}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="max"
          name="score-max"
          colon={false}
          style={{ display: "inline-block" }}
        >
          <InputNumber />
        </Form.Item>
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
