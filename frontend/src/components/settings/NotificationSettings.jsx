import React, { useState } from 'react';

export default function NotificationSettings() {
    const [notifications, setNotifications] = useState({
        emailReminders: true,
        pushAlerts: false
    });

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        console.log('Updated notification settings:', notifications);
    };

    return (
        <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <p className="text-gray-600 mb-4">Control what reminders or alerts you receive.</p>

            <div className="flex items-center justify-between mb-4">
                <label>Email Reminders</label>
                <input
                    type="checkbox"
                    checked={notifications.emailReminders}
                    onChange={() => handleToggle('emailReminders')}
                    className="h-4 w-4"
                />
            </div>

            <div className="flex items-center justify-between mb-4">
                <label>Push Alerts</label>
                <input
                    type="checkbox"
                    checked={notifications.pushAlerts}
                    onChange={() => handleToggle('pushAlerts')}
                    className="h-4 w-4"
                />
            </div>
        </div>
    );
}
