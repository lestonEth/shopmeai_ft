import React, { useState, useEffect } from "react";
import Shopmeai from "../assets/spmeai.png";

// Random color generator for profile circles
const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-purple-500", "bg-pink-500",
    "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-gray-500"
];

export default function Sidebar({ activeUser, setActiveUser }) {
    const [chatUsers, setChatUsers] = useState([]); // State for storing fetched chat users
    useEffect(() => {
        // Fetch chat users from backend API
        const fetchChatUsers = async () => {
            try {
                const response = await fetch("https://shopmeai-bc.onrender.com/chat-users"); // Replace with your actual backend URL
                const data = await response.json();
                setChatUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchChatUsers();
    }, []); // Runs once when the component mountsmpty dependency array means this runs only once when the component mounts

    return (
        <div className="w-1/4 h-full bg-[#2f2f2f] text-white overflow-hidden">
            {/* Top Header with Logo */}
            <div className="p-4 flex items-center border-b border-gray-700">
                <img src={Shopmeai} alt="Shopmeai" className="w-full rounded-full" />
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-full pb-20">
                {chatUsers.map((user, index) => {
                    // Get first two letters of username
                    const initials = user.name.split(" ").map(word => word[0]).join("").slice(0, 2);
                    // Assign a color from the list
                    const bgColor = colors[index % colors.length];

                    return (
                        <div key={index} className="flex items-center justify-between p-3 border-b border-gray-900 cursor-pointer hover:bg-[#1E1E1E]"
                            onClick={() => setActiveUser(user.name)}
                        >
                            <div className="flex items-center">
                                {/* Profile Initials with Random Background */}
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${bgColor} mr-3 font-bold text-lg`}>
                                    {initials}
                                </div>
                                {/* Contact Name & Last Message */}
                                <div>
                                    <p className="font-semibold text-gray-300">{user.name}</p>
                                    <p className="text-sm text-gray-400 truncate w-40">{user.message}</p>
                                </div>
                            </div>
                            
                            {/* Right Section: Time and Unread Indicator */}
                            <div className="flex flex-col items-end">
                                <p className="text-xs text-gray-500">{user.time}</p>
                                {user.unread && (
                                    <span className="w-3 h-3 bg-green-100 rounded-full mt-1"></span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
