import { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './NotificationIcon.css';

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
    read?: boolean;
}

function NotificationIcon() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            try {
                const parsedNotifications = JSON.parse(storedNotifications);
                // Convert string timestamps back to Date objects
                const formattedNotifications = parsedNotifications.map((notif: any) => ({
                    ...notif,
                    timestamp: new Date(notif.timestamp)
                }));
                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error parsing stored notifications:', error);
            }
        }
    }, []);

    // Listen for new notifications from other components
    useEffect(() => {
        const handleNewNotification = (event: CustomEvent<Notification>) => {
            const newNotification = event.detail;
            setNotifications(prev => {
                const updated = [...prev, newNotification];
                // Store in localStorage for persistence
                localStorage.setItem('notifications', JSON.stringify(updated));
                return updated;
            });
        };

        window.addEventListener('newNotification', handleNewNotification as EventListener);
        
        return () => {
            window.removeEventListener('newNotification', handleNewNotification as EventListener);
        };
    }, []);

    const handleClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleClose = () => {
        setShowNotifications(false);
    };

    const handleClearNotification = (id: string) => {
        setNotifications(prev => {
            const updated = prev.filter(notif => notif.id !== id);
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => {
            const updated = prev.map(notif => ({ ...notif, read: true }));
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const unreadCount = notifications.filter(notif => !notif.read).length;

    return (
        <div className="notification-container">
            <div className="notification-icon" onClick={handleClick}>
                <NotificationsIcon />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </div>
            
            {showNotifications && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className="notification-actions">
                            {notifications.length > 0 && (
                                <>
                                    <button 
                                        className="mark-read-button"
                                        onClick={handleMarkAllAsRead}
                                    >
                                        Mark all as read
                                    </button>
                                    <button 
                                        className="clear-all-button"
                                        onClick={() => {
                                            setNotifications([]);
                                            localStorage.removeItem('notifications');
                                        }}
                                    >
                                        Clear all
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                                >
                                    <span className="notification-message">
                                        {notification.message}
                                    </span>
                                    <span className="notification-time">
                                        {notification.timestamp.toLocaleTimeString()} {notification.timestamp.toLocaleDateString()}
                                    </span>
                                    <button 
                                        className="clear-notification"
                                        onClick={() => handleClearNotification(notification.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationIcon; 