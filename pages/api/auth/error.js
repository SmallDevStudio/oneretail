import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Error({ error }) {

    if (error) {
        console.log(error);
    }

}

Error.getInitialProps = ({ query }) => {
  return {
    error: query.error,
  };
};