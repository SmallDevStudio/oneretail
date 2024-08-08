import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UserListMediaModal from './media/UserListMediaModal';

Modal.setAppElement('#__next'); // เพื่อป้องกัน warning ในการใช้ Modal

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
        border: '5px solid #F68B1F',
        overflow: 'hidden',
    }
};

const UserModal = ({ isOpen, onRequestClose, onSubmit, user }) => {
    const [fullname, setFullname] = useState(user.user.fullname);
    const [birthdate, setBirthdate] = useState(user.user.birthdate ? new Date(user.user.birthdate).toISOString().split('T')[0] : '');
    const [phone, setPhone] = useState(user.user.phone);
    const [address, setAddress] = useState(user.user.address);
    const [pictureUrl, setPictureUrl] = useState(user.user.pictureUrl);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setFullname(user.user.fullname);
        setBirthdate(user.user.birthdate ? new Date(user.user.birthdate).toISOString().split('T')[0] : '');
        setPhone(user.user.phone);
        setAddress(user.user.address);
        setPictureUrl(user.user.pictureUrl);
    }, [user]);


    const showListMediaModal = () => {
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            fullname,
            birthdate,
            phone,
            address,
            pictureUrl,
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose} 
            style={customStyles}
        >
            <div className="modal-header">
                <h2 className="text-2xl font-bold">แก้ไขโปรไฟล์</h2>
                <div className='flex justify-end'>
                    <button onClick={onRequestClose} className='text-black text-xl'>
                        <svg className='w-6 h-6 text-[#F68B1F]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                            <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                {pictureUrl && (
                    <div className='mt-4'>
                        <Image src={pictureUrl} alt="User Image" width={100} height={100} className='rounded-full' 
                            onClick={showListMediaModal}
                            style={{ 
                                width: '100px', height: '100px', cursor: 'pointer', objectFit: 'cover'}}
                        />
                    </div>
                )}

                <UserListMediaModal isOpen={showModal} onRequestClose={handleCloseModal} setPictureUrl={setPictureUrl} />
                
                <span className='text-[10px] font-bold mt-1 mb-2'>Click ที่รูปเพื่ออัปโหลด</span>
                
                <form className='flex flex-col justify-start items-center w-full gap-2 mt-2' onSubmit={handleSubmit}>
                    <div className='flex gap-2 items-center'>
                        <label className='text-md font-bold'>ชื่อ-นามสกุล:</label>  
                        <input type='text'
                            name='fullname'
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className='text-md font-bold border-2 rounded-3xl pl-2' 
                        />
                    </div>
                    <div className='flex gap-2 items-center'>
                        <label className='text-md font-bold'>วันเกิด:</label>
                        <input type='date' 
                            name='birthdate'
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className='text-md font-bold border-2 rounded-3xl pl-2' 
                        />
                    </div>
                    <div className='flex gap-2 items-center'>
                        <label className='text-md font-bold'>เบอร์ติดต่อ:</label>
                        <input type='text' 
                            name='phone'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='text-md font-bold border-2 rounded-3xl pl-2' 
                        />
                    </div>
                    <div className='flex gap-2'>
                        <label className='text-md font-bold '>ที่อยู่:</label>
                        <textarea type='text' 
                            name='address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            className='text-md font-bold border-2 rounded-xl pl-2' 
                        />
                    </div>
                    <div className="flex justify-center w-full mt-5">
                        <button
                            type="submit"
                            className="btn bg-[#F68B1F] text-white pl-2 pr-2 py-1 font-bold rounded-3xl"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UserModal;
