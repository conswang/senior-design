import AppLayout from "@/components/AppLayout";
import ShowDetail from "@/components/ShowDetail";
import { PrismaClient, Donghua, DonghuaTagCN, TagCN } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

interface DetailProps {
  donghua: Donghua;
  tags: TagCN[];
}

export default function Detail({ donghua, tags }: DetailProps) {
  return (
    <AppLayout>
      <ShowDetail donghua={donghua} tags={tags}/>
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

  return {
    props: {donghua, tags},
  };
}
