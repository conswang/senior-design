import { SearchFilter } from "@/types";
import { Donghua } from "@prisma/client";
import { Button, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import ShowCard from "./ShowCard";
import { useRouter } from "next/router";

interface ShowShelfProps {
  title: string;
  searchFilter: SearchFilter;
}

export default function ShowShelf({ title, searchFilter }: ShowShelfProps) {
  const [shows, setShows] = useState<Donghua[]>([]);
  const router = useRouter();

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
        setShows(data.results);
      });
  }, [searchFilter]);

  const cards = shows.slice(0, 5).map((donghua) => {
    return <ShowCard donghua={donghua} key={donghua.id} />;
  });

  const onClick = () => {
    router.push(`/list?searchFilter=${JSON.stringify(searchFilter)}`);
  }

  return (
    <>
      <Typography.Title level={3} style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        {title} <Button size="small" onClick={onClick}>View More</Button>
      </Typography.Title>
      <Space direction="horizontal">{cards}</Space>
    </>
  );
}
