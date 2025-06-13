import React from 'react';
import UserSettings from '../components/settings/UserSettings';

export default function SettingsPage() {
    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">User Settings</h1>
            <UserSettings />
        </div>
    );
}
