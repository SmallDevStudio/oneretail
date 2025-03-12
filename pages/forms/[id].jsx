import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import AppView from "@/components/forms/AppView";
import Loading from "@/components/Loading";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Forms = () => {
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(`/api/forms/${id}`, fetcher, {
    onSuccess: (data) => {
      setFormData(data.data);
    },
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  return (
    <div>
      <AppView data={formData} />
    </div>
  );
};

export default Forms;
