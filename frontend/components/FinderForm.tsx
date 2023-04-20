import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
} from "antd";
import { SearchFilter, SortBy } from "@/types";

const dateToString = (date?: Date) => {
  if (!date) {
    return undefined;
  }
  return date.toISOString().substring(0, 10);
};

export default function FinderForm() {

  const onFinish = (fieldsValue: any) => {
    console.log(fieldsValue);

    let filter: SearchFilter = {
      query: fieldsValue["query"],
      includeNsfw: fieldsValue["include-nsfw"],
      startDate: dateToString(
        fieldsValue["air-date"] && fieldsValue["air-date"][0].$d
      ),
      endDate: dateToString(
        fieldsValue["air-date"] && fieldsValue["air-date"][1].$d
      ),
      numEpisodes: {
        min: fieldsValue["num-episodes-min"],
        max: fieldsValue["num-episodes-max"],
      },
      score: {
        min: fieldsValue["score-min"],
        max: fieldsValue["score-max"],
      },
      includePlatforms: fieldsValue["platform"],
      sortBy: fieldsValue["sort-by"],
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
          <InputNumber min={0} max={10000}  size="small"/>
        </Form.Item>
        <Form.Item
          label="max"
          name="num-episodes-max"
          colon={false}
          style={{ display: "inline-block" }}
        >
          <InputNumber min={0} max={10000}  size="small"/>
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="Platform"
        name="platform"
        initialValue={["TV", "Web", "Unknown"]}
      >
        <Checkbox.Group
          options={[
            { label: "TV", value: "TV" },
            { label: "Web", value: "Web" },
            { label: "Other", value: "Unknown" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Score" >
        <Form.Item
          label="min"
          name="score-min"
          colon={false}
          style={{ display: "inline-block", marginRight: 12 }}
        >
          <InputNumber min={0} max={10} size="small"/>
        </Form.Item>
        <Form.Item
          label="max"
          name="score-max"
          colon={false}
          style={{ display: "inline-block" }}
        >
          <InputNumber min={0} max={10} size="small"/>
        </Form.Item>
      </Form.Item>
      <Form.Item label="Sort by" name="sort-by" initialValue="BEST_MATCH">
        <Radio.Group>
          <Radio.Button value={SortBy.BEST_MATCH}>Best Match</Radio.Button>
          <Radio.Button value={SortBy.SCORE}>Score</Radio.Button>
          <Radio.Button value={SortBy.AIR_DATE}>Air Date</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
