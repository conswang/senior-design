import { TagCN } from "@prisma/client";
import { Form, Select, Spin, Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

const debounce = require("lodash.debounce");

export default function FinderFormTagField() {
  // const form = Form.useFormInstance();
  // const formTagField = Form.useWatch("tags");

  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [fetching, setFetching] = useState(false);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const reloadOptions = (searchPrefix: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetch(`api/tagSearch?searchPrefix=${searchPrefix}`, {
        method: "get",
      })
        .then((res) => {
          if (!res.ok) {
            console.error(res);
          }
          return res.json();
        })
        .then((data) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          const newOptions = data.tags.map((tagCN: TagCN) => {
            return {
              label: tagCN.nameEN,
              value: tagCN.name,
            };
          });

          setOptions(newOptions);
          setFetching(false);
        });
    };

    return debounce(reloadOptions, 100);
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      placeholder="Add tags"
      showSearch={true}
      onSearch={debounceFetcher}
      mode="multiple"
      options={options}
      notFoundContent={fetching ? <Spin size="small" /> : null}
    />
  );
}
