import React from "react";
import Sidebar from "./Sidebar";
import { Home, MessageSquare, Settings, UserCog, LogOut } from "lucide-react"; // Import Lucide Icons

export default function Container({ children, activeTab, setActiveTab, activeUser, setActiveUser }) {
    
    return (
        <div className="relative w-screen h-screen bg-gradient-to-r from-[#444] to-[#2f2f2f] overflow-hidden text-white flex flex-col items-center py-10 space-y-6 border-r border-gray-400">

            <div className="container min-h-full mx-auto flex border bg-[#202123] rounded-xl border-gray-400">
                {/* Mini Sidebar */}
                <div className="w-[80px] relative h-full bg-[#2f2f2f] text-white flex flex-col items-center py-5 space-y-6 border-r border-gray-400">
                    {/* Home Icon */}
                    <div className={`flex flex-col items-center cursor-pointer hover:bg-[#3a3a3a] w-full py-3 rounded-lg ${activeTab === "home" && "bg-[#3a3a3a]"}`}
                        onClick={() => setActiveTab("home")}
                    >
                        <Home size={24} />
                        <p className="text-xs mt-1">Home</p>
                    </div>
                    {/* Chats Icon */}
                    <div className={`flex flex-col items-center cursor-pointer hover:bg-[#3a3a3a] w-full py-3 rounded-lg ${activeTab === "chats" && "bg-[#3a3a3a]"}`}
                        onClick={() => setActiveTab("chats")}
                    >
                        <MessageSquare size={24} />
                        <p className="text-xs mt-1">Chats</p>
                    </div>
                    {/* Settings Icon */}
                    <div className={`flex flex-col items-center cursor-pointer hover:bg-[#3a3a3a] w-full py-3 rounded-lg ${activeTab === "settings" && "bg-[#3a3a3a]"}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings size={24} />
                        <p className="text-xs mt-1">Settings</p>
                    </div>
                    {/* Admin Icon */}
                    <div className={`flex flex-col items-center cursor-pointer hover:bg-[#3a3a3a] w-full py-3 rounded-lg ${activeTab === "admin" && "bg-[#3a3a3a]"}`}
                        onClick={() => setActiveTab("admin")}
                    >
                        <UserCog size={24} />
                        <p className="text-xs mt-1">Admin</p>
                    </div>

                    {/* logout */}
                    <div className="flex flex-col items-center cursor-pointer hover:bg-[#3a3a3a] w-full py-3 rounded-lg absolute bottom-0">
                        <LogOut size={24} />
                        <p className="text-xs mt-1">Logout</p>
                    </div>
                </div>

                {/* Main Sidebar */}
                {activeTab === 'chats' && <Sidebar activeUser={activeUser} setActiveUser={setActiveUser} />}
                {/* Main Content */}
                <div className="flex-1 p-5 overflow-y-scroll rounded-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
