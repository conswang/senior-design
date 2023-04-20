import AppLayout from "@/components/AppLayout";
import ShowDetail from "@/components/ShowDetail";
import { PrismaClient, Donghua } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

interface DetailProps {
  donghua: Donghua;
}

export default function Detail({ donghua }: DetailProps) {
  return (
    <AppLayout>
      <ShowDetail donghua={donghua}/>
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

  return {
    props: {donghua},
  };
}
