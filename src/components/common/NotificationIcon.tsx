import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './NotificationIcon.css';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error';
    timestamp: Date;
}

function NotificationIcon() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleClose = () => {
        setShowNotifications(false);
    };

    const handleClearNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <div className="notification-container">
            <div className="notification-icon" onClick={handleClick}>
                <NotificationsIcon />
                {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                )}
            </div>
            
            {showNotifications && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                className="clear-all-button"
                                onClick={() => setNotifications([])}
                            >
                                Clear all
                            </button>
                        )}
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
                                    className={`notification-item ${notification.type}`}
                                >
                                    <span className="notification-message">
                                        {notification.message}
                                    </span>
                                    <span className="notification-time">
                                        {new Date(notification.timestamp).toLocaleTimeString()}
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