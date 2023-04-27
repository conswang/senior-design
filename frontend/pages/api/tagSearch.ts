import { PrismaClient, TagCN } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export type TagSearchResData = {
  tags: TagCN[];
};

// For autofill tags in UI
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagSearchResData | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(400).json({ error: "unaccepted request method, use GET" });
    return;
  }

  if (typeof req.query.searchPrefix !== "string") {
    res
      .status(400)
      .json({ error: "expected string type for searchPrefix query param" });
    return;
  }

  const searchPrefix = req.query.searchPrefix;
  const prisma = new PrismaClient();

  const tags = await prisma.tagCN.findMany({
    where: {
      OR: [
        {
          nameEN: {
            startsWith: searchPrefix,
          },
        },
        {
          name: {
            startsWith: searchPrefix,
          }
        },
      ],
    },
    orderBy: {
      count: "desc",
    },
    take: 10,
  });

  res.send({tags});
}
