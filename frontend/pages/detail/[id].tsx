import { PrismaClient, Donghua } from "@prisma/client";
import { Space } from "antd";
import { GetServerSidePropsContext } from "next";

interface DetailProps {
  donghua: Donghua;
}

export default function Detail({ donghua }: DetailProps) {
  return (
    <Space direction="vertical">{`${donghua.id} lalalala ${donghua.titleChinese}`}</Space>
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
