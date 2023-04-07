import { Donghua } from "@prisma/client";
import { Col, Row, Space, Image, Typography } from "antd";
import pinyin from "pinyin";

interface ShowDetailProps {
  donghua: Donghua;
}

const getDisplayTitle = (donghua: Donghua) => {
  if (donghua.titleEnglish) {
    return donghua.titleEnglish;
  }
  if (donghua.titleChinese) {
    return pinyin(donghua.titleChinese, {
      style: pinyin.STYLE_NORMAL,
    })
      .map(([word]) => {
        return [word.charAt(0).toUpperCase() + word.slice(1)];
      })
      .join(" ");
  }
  return "Unknown Title";
};

export default function ShowDetail({ donghua }: ShowDetailProps) {
  const displayTitle = getDisplayTitle(donghua);

  return (
    <>
      <Typography.Title>{displayTitle}</Typography.Title>
      <Row>
        <Col span={6}>
          <Image src={donghua.imageUrl} width={225} preview={false} />
        </Col>
        <Col span={18}>
          <Space direction="vertical" style={{ width: "100%" }}></Space>
        </Col>
      </Row>
    </>
  );
}
