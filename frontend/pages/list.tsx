import AppLayout from "@/components/AppLayout";
import FinderForm from "@/components/FinderForm";
import ShowList from "@/components/ShowList";
import { SearchFilter } from "@/types";
import { Donghua } from "@prisma/client";
import { Collapse, Space, Typography } from "antd";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { SearchResData } from "./api/search";

interface ListProps {
  filterString: string;
}

export default function List({ filterString }: ListProps) {
  const [data, setData] = useState<SearchResData>({
    results: [],
    total: 0,
    offset: 0,
    limit: 10,
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    fetch(`/api/search?`, {
      method: "post",
      body: filterString,
    })
      .then((res) => {
        if (!res.ok) {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      });
  }, [filterString]);

  return (
    <AppLayout>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title>Shows</Typography.Title>
        <Collapse accordion activeKey={isCollapsed ? "1" : undefined} onChange={() => setIsCollapsed(!isCollapsed)}>
          <Collapse.Panel key="1" header="Sort and Filter">
            <FinderForm
              layout="horizontal"
              onFinishCallback={() => setIsCollapsed(false)}
            />
          </Collapse.Panel>
        </Collapse>
        <ShowList
          showList={data?.results}
          total={data?.total}
          offset={data?.offset}
          limit={data?.limit}
        />
      </Space>
    </AppLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const filterString = context.query.searchFilter;

  if (typeof filterString === "string") {
    return { props: { filterString } };
  }

  return { props: { filterString: "{}" } };
}
