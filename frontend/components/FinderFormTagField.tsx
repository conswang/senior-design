import { TagCN } from "@prisma/client";
import { Form, Select, Spin, Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

const debounce = require("lodash.debounce");

interface FinderFormTagFieldProps {
  tagsChangeCallback: (tags: string[]) => void;
}

export default function FinderFormTagField({
  tagsChangeCallback,
}: FinderFormTagFieldProps) {
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

          const newOptions: { label: string; value: string }[] = data.tags.map(
            (tagCN: TagCN) => {
              return {
                label: tagCN.nameEN,
                value: tagCN.name,
              };
            }
          );
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
      onChange={(_, options) => {
        if (Array.isArray(options)) {
          tagsChangeCallback(options.map(tag => tag.label))
        } else {
          console.error("Non-array options");
        }
      }}
      notFoundContent={fetching ? <Spin size="small" /> : null}
    />
  );
}
