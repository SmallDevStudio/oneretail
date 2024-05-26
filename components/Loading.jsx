import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LogoImage from './LogoImage';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className='releative w-[200px] h-[200px]'>
        <LogoImage 
          src="/dist/img/logo-one-retail.png"
          alt="One Retail Logo"
          width={200}
          height={200}
        />
      </div>
        <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        </Box>
    </div>
  );
}