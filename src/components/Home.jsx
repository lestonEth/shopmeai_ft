import React from 'react';
import Sidebar from './Sidebar'; // Assuming Sidebar component is in the same folder
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home({ activeUser, setActiveUser }) {
    // Example sales data for the graphs
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Monthly labels
        datasets: [
            {
                label: 'Sales ($)',
                data: [
                    2000,  // Jan - New Year sales push
                    1800,  // Feb - Slight dip post-New Year
                    2200,  // Mar - Spring sales promotion
                    2500,  // Apr - Tax season surge
                    2800,  // May - Mid-year growth
                    3300,  // Jun - Summer demand peak
                    4000,  // Jul - Peak summer sales
                    3500,  // Aug - Post-summer dip
                    3000,  // Sep - Back to school promotion
                    2900,  // Oct - Steady sales
                    3200,  // Nov - Holiday season starts
                    5000,  // Dec - Major holiday sales spike
                ], 
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };
    

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    return (
        <div className="flex">
            {/* Main Content Area */}
            <div className="w-full h-full bg-[#444] p-6 overflow-y-auto">
                {/* Welcome Section */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h1 className="text-3xl font-semibold text-white">Welcome, {activeUser ? activeUser : 'Guest'}!</h1>
                    <p className="text-gray-400 mt-2">This is your personalized sales dashboard. Check your chats, recent activities, and more.</p>
                </div>

                {/* Sales Activity Section */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Recent Sales Activity</h2>
                    <ul className="text-gray-400">
                        <li>Activity 1: jimleston made a purchase of $200</li>
                        <li>Activity 3: User Z left a positive review</li>
                    </ul>
                </div>

                {/* Sales Performance Graph */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Sales Performance</h2>
                    <Line data={salesData} options={options} />
                </div>

                {/* Sales Demo or Placeholder */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">Sales Demo</h2>
                    <p className="text-gray-400">Explore our latest product offerings, view pricing, and get in touch with sales representatives for more details!</p>
                </div>

                {/* Placeholder or additional content */}
                <div className="mt-6 text-gray-400">
                    <p>Feel free to explore other sections of the app!</p>
                </div>
            </div>
        </div>
    );
}
