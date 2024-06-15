import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const CommentCount = ({ contentId }) => {
  const { data, error } = useSWR(`/api/content/comments?contentId=${contentId}`, fetcher);

  if (error) return <span className="text-xs">0</span>; // Error handling
  if (!data) return <span className="text-xs">...</span>; // Loading state

  return <span className="text-xs">{data.data.length}</span>; // Assuming `data.data` contains the comments array
};

export default CommentCount;