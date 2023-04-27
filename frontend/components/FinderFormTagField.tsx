import { TagCN } from "@prisma/client";
import { Form, Select, Spin, Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

const debounce = require('lodash.debounce');

export default function FinderFormTagField() {
  const form = Form.useFormInstance();
  const formTagField = Form.useWatch("tags");

  const [options, setOptions] = useState<TagCN[]>([]);
  const [fetching, setFetching] = useState(false);
  const fetchRef = useRef(0);

  const selectOptions = options.map((tagCN) => {
    return {
      label: tagCN.nameEN,
      value: tagCN.name,
    };
  });

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
  
          setOptions(data.tags);
          setFetching(false);

          console.log("Search prefix: " + searchPrefix);
          console.log("Tags:");
          console.log(data.tags);
        });
    };

    return debounce(reloadOptions, 100);
  }, []);

  return (
    <Select
      placeholder="Add tags"
      showSearch={true}
      onSearch={debounceFetcher}
      mode="multiple"
      options={selectOptions}
      notFoundContent={fetching ? <Spin size="small" /> : null}
    />
  );
}
