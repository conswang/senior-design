import AppLayout from "@/components/AppLayout";
import ShowDetail from "@/components/ShowDetail";
import { PrismaClient, Donghua, DonghuaTagCN, TagCN } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

interface DetailProps {
  donghua: Donghua;
  recommendations: Donghua[];
  tags: TagCN[];
}

export default function Detail({ donghua, tags, recommendations }: DetailProps) {
  return (
    <AppLayout>
      <ShowDetail donghua={donghua} tags={tags} recommendations={recommendations}/>
    </AppLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;
  const prisma = new PrismaClient();

  if (typeof id != "string" || !parseFloat(id)) {
    return {
      notFound: true,
    };
  }

  const donghua = await prisma.donghua.findUniqueOrThrow({
    where: {
      id: parseFloat(id),
    },
  });

  const tags = await prisma.$queryRawUnsafe<TagCN>
    (`SELECT TagCN.name AS name, count, nameEN, tagENId FROM TagCN JOIN DonghuaTagCN ON TagCN.name = DonghuaTagCN.tagName WHERE donghuaId='${parseFloat(id)}'`)

  const recommendations = await prisma.$queryRawUnsafe<
    Donghua[]
  >(`SELECT * FROM DonghuaTagCN JOIN Donghua ON DonghuaTagCN.donghuaId = Donghua.id
   WHERE donghuaId != ${id} AND tagName in
   (SELECT tagName FROM DonghuaTagCN WHERE donghuaId=${id})
   GROUP BY donghuaId
   ORDER BY COUNT(donghuaId) DESC
   LIMIT 5`);

  return {
    props: {donghua, tags, recommendations},
  };
}
