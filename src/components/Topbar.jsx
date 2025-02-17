import React from 'react'
import { Plus } from 'lucide-react';
// Random color generator for profile circles
const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-purple-500", "bg-pink-500",
    "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-gray-500"
];

export default function Topbar( {username, onAddProduct} ) {
    const initials = username.split(" ").map(word => word[0]).join("").slice(0, 2);
    return (
        <div className="w-full flex items-center justify-between p-5 bg-[#202123] rounded-t-xl">
            <div className="username flex items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white bg-blue-600 mr-3 font-bold text-lg`}>
                    {initials}
                </div>
                <p className="font-semibold text-gray-300">{username}</p>
            </div>

            <button className="border text-white px-4 py-2 rounded-lg flex gap-3 border-gray-300" onClick={onAddProduct}>
                <Plus size={24} />
                Add products
            </button>
        </div>
    )
}
