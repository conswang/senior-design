import { Donghua } from "@prisma/client";
import ShowCard from "./ShowCard";
import { Pagination, PaginationProps, Space } from "antd";
import { useRouter } from "next/router";
import { SearchFilter } from "@/types";

interface ShowListProps {
  showList: Donghua[];
  total: number;
  offset: number;
  limit: number;
}

export default function ShowList({
  showList,
  total,
  limit,
  offset,
}: ShowListProps) {
  const router = useRouter();

  if (!showList || showList.length === 0) {
    return <></>;
  }
  
  const shows = showList.map((show) => {
    return <ShowCard donghua={show} key={show.id} />;
  });

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    const newOffset = limit * (pageNumber - 1);
    let newFilterString;
    if (typeof router.query.searchFilter === "string") {
      const filterString = router.query.searchFilter;
      const filter: SearchFilter = JSON.parse(filterString);
      filter["offset"] = newOffset;
      newFilterString = JSON.stringify(filter);
    } else {
      newFilterString = JSON.stringify({offset: newOffset});
    }

    router.push(`/list?searchFilter=${newFilterString}`);
  }

  return (
    <Space direction="vertical" size="small">
      {shows}
      <Pagination
        style={{ margin: "24px 0" }}
        total={total}
        pageSize={limit}
        showQuickJumper={true}
        showSizeChanger={false}
        current={offset / limit + 1}
        onChange={onChange}
      />
    </Space>
  );
}
