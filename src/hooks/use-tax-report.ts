import useAuthFetch from "@/hooks/use-auth-fetch";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

export default function useTaxReport() {
  const authFetch = useAuthFetch();
  const fetcher = (url: string) => authFetch<{ reports: any[] }>(url);
  const { data } = useSWR("/api/stripe/tax/report", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const [activeFile, setActiveFile] = useState();
  const { mutate } = useSWRConfig();

  const handleCreateTaxReport = ({
    interval_start,
    interval_end,
  }: {
    interval_start: number;
    interval_end: number;
  }) =>
    authFetch<any>("/api/stripe/tax/report", {
      method: "POST",
      body: JSON.stringify({ interval_start, interval_end }),
    }).then(() => mutate("/api/stripe/tax/report"));

  const fetchFileLink = async (fileId: string) =>
    authFetch<any>(`/api/stripe/tax/report/${fileId}`).then(({ fileLink }) =>
      setActiveFile(fileLink?.url)
    );

  useEffect(() => {
    if (activeFile) {
      window.open(activeFile, "_blank");

      setTimeout(() => {
        setActiveFile(undefined);
      }, 1000);
    }
  }, [activeFile]);

  return { handleCreateTaxReport, taxReports: data?.reports, fetchFileLink };
}
