import React from 'react';
import { useRouter } from 'next/router';
import useLine from '@/lib/hook/useLine';

export default function HomePage(props) {
  const { status, } = props
  const { login, logout, idTokens, accessTokens } = useLine();
  const router = useRouter();

  if (status === 'registered') {
    return router.push('/auth/adduser');
  } else if (status !== 'inited') {
    return (
      <div>
        <p>Log-in</p>
        <button className='btn bg-primary' onClick={login}>Log-in</button>
      </div>
    );
  }

  return (
    <div>
      <p>Home</p>
      <button className='btn bg-primary' onClick={logout}>Log-out</button>
    </div>
  );
}