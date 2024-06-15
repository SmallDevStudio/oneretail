import React from "react";
import PostList from "@/components/PostList";
import CreatePost from "@/components/CreatePost";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from "swr";
import Loading from "../Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ShareYourStory = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
  const { data: posts, error: postError } = useSWR('/api/posts', fetcher, { refreshInterval: 1000 });

  const handlePostCreated = async (newPost) => {
    // อัปเดตข้อมูลโพสต์ใหม่ทันที
    await mutate('/api/posts', { data: [newPost, ...posts.data] }, false);
    // รีเฟรชข้อมูลโพสต์ทั้งหมด
    await mutate('/api/posts');
  };

  if (!user || !posts) return <Loading />;
  if (userError || postError) return <div>Error loading data</div>;

  return (
    <div className="home mb-20">
      <CreatePost user={user.user} onPostCreated={handlePostCreated} />
      <div className="flex">
        <PostList posts={posts.data} user={user.user} />
      </div>
    </div>
  );
};

export default ShareYourStory;
