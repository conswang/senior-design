import { Donghua } from "@prisma/client";
import { Card, Col, Space, Typography, Image } from "antd";
import Link from "next/link";
import {
  getDisplayTitle,
  getDisplaySummary,
  placeHolderImage,
} from "./showUtil";

interface ShowCardProps {
  donghua: Donghua;
  cardSize?: number;
}

export default function ShowCard({ donghua, cardSize = 250 }: ShowCardProps) {
  const displayTitle = getDisplayTitle(donghua);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <Link href={`/detail/${donghua.id}`}>
        <Image
          src={donghua.imageUrl || placeHolderImage}
          preview={false}
          height={cardSize}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 100,
            background:
              "linear-gradient(0deg, rgba(0,0,0,1) 25%, rgba(255,255,255,0) 100%)",
          }}
        ></div>
        <div style={{ position: "absolute", bottom: 0, left: 0, margin: 8 }}>
          <Typography.Text style={{ color: "whitesmoke" }} strong={true}>
            {displayTitle}
          </Typography.Text>
        </div>
      </Link>
    </div>
  );
}
