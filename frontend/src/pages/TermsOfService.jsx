const TermsOfService = () => {
    return (
        <div className="p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-700 mb-4">
                    By using this application, you agree to the following terms and conditions.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Use of Service</h2>
                <p className="text-gray-700 mb-4">
                    This app is provided as-is to help you track your finances. You are responsible for the accuracy of the information you provide.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Account Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Keep your login credentials secure</li>
                    <li>Do not attempt to access or interfere with accounts that are not yours</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Limitations</h2>
                <p className="text-gray-700 mb-4">
                    This service does not provide financial advice and should not be relied upon as a substitute for professional consultation.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Termination</h2>
                <p className="text-gray-700 mb-4">
                    We reserve the right to suspend or delete accounts that violate these terms or misuse the platform.
                </p>

                <p className="text-gray-500 text-sm">Last updated: June 2025</p>
            </div>
        </div>
    );
};

export default TermsOfService;
