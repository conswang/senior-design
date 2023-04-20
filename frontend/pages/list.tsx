import AppLayout from "@/components/AppLayout";
import FinderForm from "@/components/FinderForm";
import ShowList from "@/components/ShowList";
import { SearchFilter } from "@/types";
import { Donghua } from "@prisma/client";
import { Collapse, Space, Typography } from "antd";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ListProps {
  filterString: string;
}

export default function List({ filterString }: ListProps) {
  const router = useRouter();
  const [results, setResults] = useState<Donghua[]>();

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const filterString = context.query?.searchFilter;

  if (typeof filterString === "string") {
    return { props: { filterString } };
  }

  return {
    notFound: true,
  };
}
