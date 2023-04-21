import { Donghua } from "@prisma/client";
import { Card, Col, Row, Image, Typography, Space } from "antd";
import { getDisplaySummary, getDisplayTitle, placeHolderImage } from "./showUtil";
import Link from "next/link";

interface ShowCardProps {
  donghua: Donghua
}

export default function ShowCard({donghua}: ShowCardProps) {
  const displayTitle = getDisplayTitle(donghua);
  const displaySummary = getDisplaySummary(donghua, 200);

  return <Card size="small" title={<Link href={`/detail/${donghua.id}`}>{displayTitle}</Link>}>
    <Row>
      <Space size="large">
        <Image src={donghua.imageUrl || placeHolderImage} preview={false} width={80}/>
        <Typography.Paragraph>{displaySummary}</Typography.Paragraph>
      </Space>
    </Row>
  
  </Card>
}