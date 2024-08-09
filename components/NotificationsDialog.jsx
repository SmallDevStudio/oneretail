import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import useSWR from 'swr';
import Loading from '@/components/Loading';

const fetcher = (url) => fetch(url).then((res) => res.json());

const NotificationsDialog = ({ open, onClose, userId }) => {
    const { data: notifications, error: notificationsError } = useSWR(`/api/notifications/all/${userId}`, fetcher);

    if (notificationsError) return <div>Error loading data</div>;
    if (!notifications) return <Loading />;

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <span>All Notifications</span>

                <li>
                    {notifications.data.map((notification) => (
                        <ListItem key={notification._id} button component="a" href={notification.url || '#'}>
                            <ListItemText primary={notification.description} secondary={new Date(notification.createAt).toLocaleString()} />
                        </ListItem>
                    ))}
                </li>
        
        </Dialog>
    );
};

export default NotificationsDialog;