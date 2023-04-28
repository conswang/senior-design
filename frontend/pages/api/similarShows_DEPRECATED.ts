import { Donghua, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export type SimilarShowsResData = {
  results: Donghua[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimilarShowsResData | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(400).json({ error: "unaccepted request method, use GET" });
    return;
  }

  const idString = req.query.id;
  if (typeof idString !== "string" || !parseInt(idString)) {
    res.status(400).json({
      error: `unparseable donghua id ${idString?.toString()}, must be number`,
    });
    return;
  }

  const id = parseInt(idString);

  const prisma = new PrismaClient();

  const results = await prisma.$queryRawUnsafe<
    Donghua[]
  >(`SELECT * FROM DonghuaTagCN JOIN Donghua ON DonghuaTagCN.donghuaId = Donghua.id
   WHERE donghuaId != ${id} AND tagName in
   (SELECT tagName FROM DonghuaTagCN WHERE donghuaId=${id})
   GROUP BY donghuaId
   ORDER BY COUNT(donghuaId) DESC
   LIMIT 5`);

  res.send({ results });
}
