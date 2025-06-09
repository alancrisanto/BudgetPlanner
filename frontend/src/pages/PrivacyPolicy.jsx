const PrivacyPolicy = () => {
    return (
        <div className="p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-700 mb-4">
                    We take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our application.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Information We Collect</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Name and email address during registration</li>
                    <li>Financial data you manually input (e.g., accounts, transactions)</li>
                    <li>Login activity and usage analytics</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>To provide and personalize your dashboard and tools</li>
                    <li>To maintain app security and functionality</li>
                    <li>To improve user experience and features</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Data Security</h2>
                <p className="text-gray-700 mb-4">
                    All user data is stored securely. We use best practices to protect your information and prevent unauthorized access.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Your Rights</h2>
                <p className="text-gray-700 mb-4">
                    You may delete your account and all associated data at any time through the account settings page. We do not sell or share your personal data.
                </p>

                <p className="text-gray-500 text-sm">Last updated: June 2025</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
