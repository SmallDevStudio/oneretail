import React from 'react';
import { useRouter } from 'next/router';
import useLine from '@/lib/hook/useLine';
import Image from 'next/image';
import LineLogoIcon from '@/resources/icons/LineLogoIcon';

export default function HomePage(props) {
  const { status } = props
  const { login, logout } = useLine();
  const router = useRouter();

 // if (status === 'registered') {
   // return router.push('/auth/adduser');
 // } else if (status !== 'inited') {
    return (
      <div className="releative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center justify-center w-full">
                <Image
                    src="/dist/img/logo-one-retail.png"
                    alt="One Retail Logo"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="inline"
                    priority
                    style={{
                        width: "300px",
                        height: "auto",
                    }}
                />

                <div className="mt-5">
               
                    <button type="button" 
                            className="text-white bg-[#06C755] hover:bg-[#06C755]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center font-semibold dark:focus:ring-[#06C755]/55 me-2 mb-2"
                            onClick={() => login()}
                            >
                        <LineLogoIcon className="w-6 h-6 me-2 mr-5 "/>
                        Sign in with Line
                    </button>

                </div>
            </div>
        </div>
    );
  }

 //return (
 //   <div>
  //    <p>Home</p>
  //    <button className='btn bg-primary' onClick={logout}>Log-out</button>
 //   </div>
//  );
// }