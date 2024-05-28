import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';

export default function Loading() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div className='text-center justify-center items-center'>
                <div className='flex mb-10'>
                    <Image src="/dist/img/logo-one-retail.png" alt="one Retail Logo" width={150} height={150} priority/>
                </div>
                <CircularProgress />
            </div>
        </div>
    );
}