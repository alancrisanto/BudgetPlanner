import React, { useState } from 'react';
import UserSettings from '../components/settings/UserSettings';
import NotificationSettings from '../components/settings/NotificationSettings';

const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' }
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    const renderContent = () => {
        switch (activeTab) {
            case 'notifications':
                return <NotificationSettings />;
            default:
                return <UserSettings />;
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Settings</h1>

            {/* Dropdown on mobile */}
            <div className="sm:hidden mb-4">
                <select
                    className="w-full border rounded p-2"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                            {tab.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tab buttons on desktop */}
            <div className="hidden sm:flex space-x-4 mb-6 border-b pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 font-medium ${activeTab === tab.id
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div>{renderContent()}</div>
        </div>
    );
}
