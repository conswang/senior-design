import AppLayout from "@/components/AppLayout";
import FinderForm from "@/components/FinderForm";
import ShowList from "@/components/ShowList";
import { Donghua } from "@prisma/client";
import { Collapse, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function List() {
  const router = useRouter();
  const [results, setResults] = useState<Donghua[]>();
  let searchFilter = {};

  if (typeof router.query?.searchFilter == "string") {
    searchFilter = router.query?.searchFilter;
  }

  useEffect(() => {
    fetch(`/api/search?`, {
      method: "post",
      body: JSON.stringify(searchFilter),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setResults(data.results);
      });
  }, []);

  return (
    <AppLayout>
      <Space direction="vertical">
        <Typography.Title>Shows</Typography.Title>
        <Collapse>
          <Collapse.Panel key="1" header="Sort and Filter">
            <FinderForm />
          </Collapse.Panel>
        </Collapse>
        <ShowList showList={results} />
      </Space>
    </AppLayout>
  );
}
