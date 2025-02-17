import React, { useState } from 'react';

export default function Settings({ activeUser, setActiveUser }) {
    const [username, setUsername] = useState(activeUser || "Guest");
    const [email, setEmail] = useState(""); // You can replace with actual user email if available
    const [password, setPassword] = useState("");
    const [notificationEnabled, setNotificationEnabled] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle form submission (e.g., update user settings)
        console.log("Settings Updated:", { username, email, password, notificationEnabled });
    };

    return (
        <div className="flex">
            {/* Main Content Area */}
            <div className="w-full h-full bg-[#444] rounded-xl p-6 overflow-y-auto">
                {/* Settings Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-white">Settings</h1>
                    <p className="text-gray-400 mt-2">Manage your account settings, preferences, and more.</p>
                </div>

                {/* Settings Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-gray-900 p-4 rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">Account Settings</h2>

                        {/* Username */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="w-full p-2 bg-gray-700 text-white rounded-lg"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 bg-gray-700 text-white rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 bg-gray-700 text-white rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-gray-900 p-4 rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">Notification Settings</h2>

                        <div className="flex items-center">
                            <label htmlFor="notifications" className="text-gray-300 mr-4">Enable Notifications</label>
                            <input
                                type="checkbox"
                                id="notifications"
                                checked={notificationEnabled}
                                onChange={(e) => setNotificationEnabled(e.target.checked)}
                                className="text-green-500"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full"
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
}
