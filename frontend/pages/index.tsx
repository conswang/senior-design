import AppLayout from "@/components/AppLayout";
import { Space } from "antd";
import ShowShelf from "@/components/ShowShelf";
import { SortBy } from "@/types";

export default function Home() {
  return (
    <AppLayout>
      <Space direction="vertical">
        <ShowShelf
          title="Popular"
          searchFilter={{ sortBy: SortBy.POPULAR, startDate: "2010-01-01" }}
        />
        <ShowShelf title="New" searchFilter={{ sortBy: SortBy.AIR_DATE }} />
        <ShowShelf
          title="Movies"
          searchFilter={{
            tags: ["剧场版"],
            sortBy: SortBy.POPULAR,
            startDate: "2010-01-01",
          }}
        />
      </Space>
    </AppLayout>
  );
}
