import { Donghua, DonghuaTagCN, TagCN } from "@prisma/client";
import { Col, Row, Space, Image, Typography, Divider, Tag } from "antd";
import { getDisplayPlatform, getDisplaySummary, getDisplayTitle, placeHolderImage } from "./showUtil";

interface ShowDetailProps {
  donghua: Donghua;
  tags: TagCN[];
}

export default function ShowDetail({ donghua, tags }: ShowDetailProps) {
  const displayTitle = getDisplayTitle(donghua);
  const displaySummary = getDisplaySummary(donghua);

  let leftColumnInfo: Array<{ name?: string; value: string }> = [
    {
      name: "Chinese title",
      value: donghua.titleChinese!,
    },
  ];

  if (donghua.platform !== "Unknown") {
    leftColumnInfo.push({
      name: "Platform",
      value: getDisplayPlatform(donghua.platform),
    });
  }
  if (donghua.numEpisodes) {
    leftColumnInfo.push({
      name: "Episodes",
      value:
        donghua.numEpisodes.toString() +
        (donghua.episodeLength ? ` episodes / ${donghua.episodeLength}` : ""),
    });
  }
  // TODO: combine start/end dates into 1 field
  const startDate = donghua.startDate && donghua.startDate != "1900-01-01" ? donghua.startDate : "??"
  const endDate = donghua.endDate && donghua.endDate != "2100-01-01" ? donghua.endDate : "??"
  leftColumnInfo.push({
    name: "Air date",
    value: `${startDate} to ${endDate}`
  })

  if (donghua.source) {
    leftColumnInfo.push({
      name: "Source",
      value: donghua.source,
    });
  }

  leftColumnInfo.push({
    name: "NSFW",
    value: donghua.nsfw ? "yes" : "no",
  });

  const leftColumnElements = leftColumnInfo.map((info, index) => {
    return (
      <div key={index}>
        {info.name && (
          <Typography.Text strong>{`${info.name}:`}</Typography.Text>
        )}
        <Typography.Text>{`\t${info.value}`}</Typography.Text>
      </div>
    );
  });

  const tagList = tags.length > 0 ? tags.map((tag) => {
    return <Tag>{tag.nameEN}</Tag>
  }) : <Typography.Text>No tags ¯\_(˶′◡‵˶)_/¯</Typography.Text>

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title>{displayTitle}</Typography.Title>
      <Row>
        <Col span={6}>
          <Image src={donghua.imageUrl || placeHolderImage} width={225} preview={false} />
          <Divider />
          <Space direction="vertical" size="small">
            {leftColumnElements}
          </Space>
        </Col>
        <Col span={18}>
          <Space
            direction="vertical"
            style={{ width: "100%", padding: "0 24px" }}
          >
            <div>
              <Typography.Title level={3} style={{ marginTop: 0 }}>
                Synopsis
              </Typography.Title>
              <Typography.Paragraph>
                {displaySummary}
              </Typography.Paragraph>
              <Typography.Title level={3}>Tags</Typography.Title>
              <Space wrap>{tagList}</Space>
            </div>
          </Space>
        </Col>
      </Row>
    </Space>
  );
}
