import { Donghua } from "@prisma/client";
import { Col, Row, Space, Image, Typography, Divider } from "antd";
import { getDisplayPlatform, getDisplayTitle } from "./showUtil";
import ShowCard from "./ShowCard";

interface ShowDetailProps {
  donghua: Donghua;
}

export default function ShowDetail({ donghua }: ShowDetailProps) {
  const displayTitle = getDisplayTitle(donghua);

  let leftColumnInfo: Array<{ name?: string; value: string }> = [
    {
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
  if (donghua.startDate && donghua.startDate != "1900-01-01") {
    leftColumnInfo.push({
      name: "From",
      value: donghua.startDate,
    });
  }
  if (donghua.endDate && donghua.endDate != "2100-01-01") {
    leftColumnInfo.push({
      name: "To",
      value: donghua.endDate,
    });
  }
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

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title>{displayTitle}</Typography.Title>
      <Row>
        <Col span={6}>
          <Image src={donghua.imageUrl!} width={225} preview={false} />
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
                {donghua.summaryEnglish?.replace(/(&quot\;)/g, '"')}
              </Typography.Paragraph>
            </div>
          </Space>
        </Col>
      </Row>
      <Row><ShowCard donghua={donghua}/></Row>
    </Space>
  );
}
