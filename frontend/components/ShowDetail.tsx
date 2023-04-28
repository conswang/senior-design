import { Donghua, DonghuaTagCN, Prisma, TagCN } from "@prisma/client";
import {
  Col,
  Row,
  Space,
  Image,
  Typography,
  Divider,
  Tag,
  Statistic,
} from "antd";
import {
  getDisplayChineseTitle,
  getDisplayPlatform,
  getDisplaySummary,
  getDisplayTitle,
  getYouTubeId,
  placeHolderImage,
} from "./showUtil";
import { useRouter } from "next/router";
import YouTube from "react-youtube";
import ShowCard from "./ShowCard";

interface ShowDetailProps {
  donghua: Donghua;
  recommendations: Donghua[];
  tags: TagCN[];
}

export default function ShowDetail({
  donghua,
  tags,
  recommendations,
}: ShowDetailProps) {
  const displayTitle = getDisplayTitle(donghua);
  const displaySummary = getDisplaySummary(donghua);
  const router = useRouter();

  let leftColumnInfo: Array<{ name?: string; value: string }> = [];

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
  const startDate =
    donghua.startDate && donghua.startDate != "1900-01-01"
      ? donghua.startDate
      : "??";
  const endDate =
    donghua.endDate && donghua.endDate != "2100-01-01" ? donghua.endDate : "??";
  leftColumnInfo.push({
    name: "Air date",
    value: `${startDate} to ${endDate}`,
  });

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

  const onClickTag = (tagName: string) => {
    router.push(`/list?searchFilter={"tags": ["${tagName}"]}`);
  };

  const tagList =
    tags.length > 0 ? (
      tags.map((tag) => {
        return (
          <Tag key={tag.name} onClick={() => onClickTag(tag.name)}>
            {tag.nameEN}
          </Tag>
        );
      })
    ) : (
      <Typography.Text>No tags ¯\_(˶′◡‵˶)_/¯</Typography.Text>
    );

  const synonyms =
    (donghua.otherTitles! as Prisma.JsonArray).join(", ") ||
    `No synonyms ¯\\_(　´∀｀)_/¯`;

  const trailerId = getYouTubeId(donghua.trailerUrl);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Title>{displayTitle}</Typography.Title>
        <Typography.Text
          type="secondary"
          style={{ marginTop: 0 }}
        >{`${donghua.titleChinese!} / ${getDisplayChineseTitle(
          donghua
        )}`}</Typography.Text>
      </div>
      <Row>
        <Col span={6}>
          <Image
            src={donghua.imageUrl || placeHolderImage}
            width={225}
            preview={false}
          />
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
              <Typography.Paragraph>{displaySummary}</Typography.Paragraph>
              <Space size="large" style={{ padding: "8px 0" }}>
                <Statistic title="Score" value={donghua.score || "N/A"} />
                <Statistic
                  title="Scored by"
                  value={donghua.scoreCount || "N/A"}
                />
              </Space>
              <Typography.Title level={3}>Tags</Typography.Title>
              <Space wrap>{tagList}</Space>
              <Typography.Title level={3}>Synonyms</Typography.Title>
              <Typography.Text>{synonyms}</Typography.Text>
              {trailerId && (
                <>
                  <Typography.Title level={3}>Trailer</Typography.Title>
                  <YouTube videoId={trailerId} />
                </>
              )}
              {recommendations.length > 0 && (
                <>
                  <Typography.Title level={3}>Similar Shows</Typography.Title>
                  <Space direction="horizontal">
                    {recommendations.map((show) => {
                      return <ShowCard donghua={show} key={donghua.id} cardSize={150}/>;
                    })}
                  </Space>
                </>
              )}
            </div>
          </Space>
        </Col>
      </Row>
    </Space>
  );
}
