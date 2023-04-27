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
}

export default function ShowCard({ donghua }: ShowCardProps) {
  const displayTitle = getDisplayTitle(donghua);
  const displaySummary = getDisplaySummary(donghua, 200);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <Link href={`/detail/${donghua.id}`}>
        <Image
          src={donghua.imageUrl || placeHolderImage}
          preview={false}
          height={250}
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
