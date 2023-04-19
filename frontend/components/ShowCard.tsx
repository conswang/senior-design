import { Donghua } from "@prisma/client";
import { Card, Col, Row, Image, Typography, Space } from "antd";
import { getDisplayTitle } from "./showUtil";

interface ShowCardProps {
  donghua: Donghua
}

export default function ShowCard({donghua}: ShowCardProps) {
  const displayTitle = getDisplayTitle(donghua);

  return <Card title={displayTitle}>
    <Row>
      <Space size="large">
        <Image src={donghua.imageUrl!} preview={false} width={80}/>
        <Typography.Paragraph>{donghua.summaryEnglish}</Typography.Paragraph>
      </Space>
    </Row>
  
  </Card>
}