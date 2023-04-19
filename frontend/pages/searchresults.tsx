import AppLayout from "@/components/AppLayout";
import ShowList from "@/components/ShowList";
import { Donghua } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const router = useRouter();
  const [results, setResults] = useState<Donghua[]>();
  let searchFilter = {};

  if (typeof router.query?.searchFilter == "string") {
    searchFilter = router.query?.searchFilter;
  }

  useEffect(() => {
    fetch(`/api/search?`, {
      method: "post",
      body: JSON.stringify(searchFilter),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setResults(data.results);
      });
  }, []);

  return (
    <AppLayout>
      <ShowList showList={results} />
    </AppLayout>
  );
}
