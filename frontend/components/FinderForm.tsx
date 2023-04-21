import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
} from "antd";
import { SearchFilter, SortBy } from "@/types";
import { useRouter } from "next/router";
import { Donghua_platform } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

type FormValues = {
  query: string;
  includeNsfw: boolean;
  airDate?: [dayjs.Dayjs, dayjs.Dayjs];
  numEpisodesMin?: number;
  numEpisodesMax?: number;
  scoreMin?: number;
  scoreMax?: number;
  includePlatforms: Donghua_platform[];
  sortBy: SortBy;
};

const dateToString = (date?: Date) => {
  if (!date) {
    return undefined;
  }
  return date.toISOString().substring(0, 10);
};

interface FinderFormProps {
  layout?: FormProps["layout"];
  onFinishCallback?: () => void;
}

export default function FinderForm({ layout, onFinishCallback}: FinderFormProps) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<FormValues>({
    query: "",
    includeNsfw: true,
    includePlatforms: [
      Donghua_platform.TV,
      Donghua_platform.WEB,
      Donghua_platform.Unknown,
    ],
    sortBy: SortBy.BEST_MATCH,
  });

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

    router.push(`/list?searchFilter=${JSON.stringify(filter)}`);
    onFinishCallback && onFinishCallback();
  };

  useMemo(() => {
    if (typeof router.query.searchFilter === "string") {
      const initialFilter: SearchFilter = JSON.parse(router.query.searchFilter);
      setInitialValues({
        ...initialValues,
        query: initialFilter.query || "",
        includeNsfw: initialFilter.includeNsfw || false,
        ...(initialFilter.includePlatforms && {
          includePlatforms: initialFilter.includePlatforms,
        }),
        ...(initialFilter.sortBy && { sortBy: initialFilter.sortBy }),
        ...(initialFilter.score?.min && { scoreMin: initialFilter.score.min }),
        ...(initialFilter.score?.max && { scoreMax: initialFilter.score.max }),
        ...(initialFilter.numEpisodes?.min && {
          numEpisodesMin: initialFilter.numEpisodes.min,
        }),
        ...(initialFilter.numEpisodes?.max && {
          numEpisodesMax: initialFilter.numEpisodes.max,
        }),
        ...(initialFilter.startDate &&
          initialFilter.endDate && {
            airDate: [
              dayjs(initialFilter.startDate),
              dayjs(initialFilter.endDate),
            ],
          }),
      });
    }
  }, [router, router.query.searchFilter]);

  return (
    <Form
      {...(layout === "horizontal" && {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      })}
      size="small"
      layout={layout}
      style={{ width: "100%" }}
      onFinish={onFinish}
    >
      <Form.Item label="Query" name="query" initialValue={initialValues.query}>
        <Input />
      </Form.Item>
      <Form.Item label="Air date" name="air-date">
        <DatePicker.RangePicker defaultValue={initialValues.airDate} />
      </Form.Item>
      <Form.Item label="Include NSFW" name="include-nsfw">
        <Switch defaultChecked={initialValues.includeNsfw} />
      </Form.Item>
      <Form.Item label="Number of episodes">
        <Form.Item
          label="min"
          name="num-episodes-min"
          colon={false}
          style={{ display: "inline-block", marginRight: 12 }}
          initialValue={initialValues.numEpisodesMin}
        >
          <InputNumber min={0} max={10000} size="small" />
        </Form.Item>
        <Form.Item
          label="max"
          name="num-episodes-max"
          colon={false}
          style={{ display: "inline-block" }}
          initialValue={initialValues.numEpisodesMax}
        >
          <InputNumber min={0} max={10000} size="small" />
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="Platform"
        name="platform"
        initialValue={initialValues.includePlatforms}
      >
        <Checkbox.Group
          options={[
            { label: "TV", value: Donghua_platform.TV },
            { label: "Web", value: Donghua_platform.WEB },
            { label: "Other", value: Donghua_platform.Unknown },
          ]}
        />
      </Form.Item>
      <Form.Item label="Score">
        <Form.Item
          label="min"
          name="score-min"
          colon={false}
          style={{ display: "inline-block", marginRight: 12 }}
          initialValue={initialValues.scoreMin}
        >
          <InputNumber min={0} max={10} size="small" />
        </Form.Item>
        <Form.Item
          label="max"
          name="score-max"
          colon={false}
          style={{ display: "inline-block" }}
          initialValue={initialValues.scoreMax}
        >
          <InputNumber min={0} max={10} size="small" />
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="Sort by"
        name="sort-by"
        initialValue={initialValues.sortBy}
      >
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
