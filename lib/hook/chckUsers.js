import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";


const fetcher = (url) => fetch(url).then((res) => res.json());
const CheckUser = () => {
    const { data: session, status } = useSession();
    const [isRegisterd, setIsRegisterd] = useState(false);
    const router = useRouter();
    const userId = session?.user?.id;
    const { data, error } = useSWR(`/api/users/${userId}`, fetcher);
    console.log('data:', data);
    
    useEffect(() => {
      try {
        if (data == null) {
          setIsRegisterd(false);
          if (typeof window !== 'undefined'){
            localStorage.removeItem('user');
            localStorage.setItem('isRegisterd', false);
          }
        }
        const user = data.user;
        if (user === null) {
          setIsRegisterd(false);
          if (typeof window !== 'undefined'){
            localStorage.removeItem('user');
            localStorage.setItem('isRegisterd', false);
          }
        } else {
          setIsRegisterd(true);
          if (typeof window !== 'undefined'){
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isRegisterd', true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, [data])
   
  return { isRegisterd, setIsRegisterd };
}

export default CheckUser;