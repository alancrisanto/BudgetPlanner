import React, { useState } from 'react';
import UserSettings from '../components/settings/UserSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import { Helmet } from 'react-helmet-async';

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

        <>
            <Helmet>
                <title>Settings | Budget Planner</title>
                <meta name="description" content="Manage your BudgetPlanner profile settings, update preferences, and configure your financial tools." />
                <meta name="keywords" content="settings, user settings, profile, preferences, account configuration, budgetplanner" />
                <meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

                <meta property="og:title" content="BudgetPlanner | Settings" />
                <meta property="og:description" content="Customize your BudgetPlanner experience in your user settings." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="" />
                <meta property="og:image" content="" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="BudgetPlanner | Settings" />
                <meta name="twitter:description" content="Adjust your account and preferences on BudgetPlanner." />
                <meta name="twitter:image" content="" />

                <link rel="canonical" href="" />
            </Helmet>

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
        </>
        
    );
}
