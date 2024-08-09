import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import useSWR from 'swr';
import Loading from '@/components/Loading';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

const NotificationsDialog = ({ open, onClose, userId }) => {
    const { data: notifications, error: notificationsError } = useSWR(`/api/notifications/all/${userId}`, fetcher);

    if (notificationsError) return <div>Error loading data</div>;
    if (!notifications) return <Loading />;

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <span>All Notifications</span>

                <ul>
                    {notifications.data.map((notification) => (
                        <Link key={notification._id} href={notification.url || '#'}>
                        <li>
                            <span>{notification.description}  </span>
                        </li>
                        </Link>
                    ))}
                </ul>
        
        </Dialog>
    );
};

export default NotificationsDialog;