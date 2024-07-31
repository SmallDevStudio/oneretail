import Image from 'next/image';
import React from 'react';
import Modal from 'react-modal';
import Link from 'next/link';

Modal.setAppElement('#__next'); // Ensure this is correct and matches your main app element

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '20px',
      height: 'auto',
      width: '350px',
    }
};

const LinkModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal 
        isOpen={isOpen} 
        onRequestClose={onRequestClose} 
        style={customStyles}
    >
      <div className="modal-header">
        <div className='flex justify-end w-full'>
            <button onClick={onRequestClose} className='text-black text-xl'>
                <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                    <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                </svg>
            </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ">
        <p className="text-xl font-bold text-[#0056FF] mb-2">รวม Link</p>
        <table className="w-full table-auto">
          <thead className="bg-[#FF9800]/50">
            <tr className="bg-[#FF9800]/50">
              <th className="text-center">No</th>
              <th>Name</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border border-gray-200">
            <tr>
              <td className="text-center">1</td>
              <td className='text-sm'>ttb Learning</td>
              <td className='text-sm'>
                <Link href="https://ttblearning.sabacloud.com">
                  Click
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-center">2</td>
              <td className='text-sm'>Facebook ส้มฟ้าพาลุย</td>
              <td className='text-sm'>
                <Link href="https://www.facebook.com/share/sQEShZViAtMkFW8w/?mibextid=K35XfP">
                  Click
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-center">3</td>
              <td className='text-sm'>สมัครสอบประกันชีวิต ประกันวินาศ กับ คปภ.</td>
              <td className='text-sm'>
                <Link href="https://onlinewebadt2.oic.or.th/oiciiqe/RegisterGeneral/RegisterGeneral">
                  Click
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-center">4</td>
              <td className='text-sm'>ตรวจสอบใบอนุญาตประกันชีวิตหรือประกันวินาศ บนระบบ (e-Licensing) ในรูปแบบอิเล็กทรอนิกส์</td>
              <td className='text-sm'>
                <Link href="https://smart.oic.or.th/E_Licensing_Entry/Login">
                  Click
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-center">5</td>
              <td className='text-sm'>ตรวจสอบทะเบียนใบอนุญาต ประกันชีวิต ประกันวินาศ (คปภ.)</td>
              <td className='text-sm'>
                <Link href="https://smart.oic.or.th/EService/Menu1">
                  Click
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-center">6</td>
              <td className='text-sm'>ตรวจสอบทะเบียนใบอนุญาต IC License (กลต.)</td>
              <td className='text-sm'>
                <Link href="https://market.sec.or.th/public/orap/IC01.aspx?lang=th">
                  Click
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default LinkModal;
