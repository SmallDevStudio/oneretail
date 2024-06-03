import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserLevel() {
    const router = useRouter();
    const { userId } = router.query;
    const { data, error } = useSWR(`/api/level/${userId}`, fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <div>
          <h1>User Level</h1>
          <p>Level: {data.level}</p>
          <p>Total Points: {data.points}</p>
        </div>
      );
}