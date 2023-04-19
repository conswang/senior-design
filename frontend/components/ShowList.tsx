import { Donghua } from "@prisma/client";
import ShowCard from "./ShowCard";
import { Space } from "antd";

interface ShowListProps {
  showList?: Donghua[];
}

export default function ShowList({ showList }: ShowListProps) {
  if (!showList) {
    return <></>;
  }

  const shows = showList.map((show) => {
    return <ShowCard donghua={show} key={show.id}/>;
  });

  return <Space direction="vertical" size="small" style={{width: "100%"}}>{shows}</Space>;
}