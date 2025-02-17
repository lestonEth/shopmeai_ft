import React from 'react'
import { LogOut, MessageCircle } from 'lucide-react';  // Import the necessary icons
import MessageInput from './MessageInput';
import ChatWindow from './ChatWindow';
import ShopMeai from '../assets/spmeai.png';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import PaymentModal from './CheckoutForm';

const stripePromise = loadStripe("pk_live_b5qxNS2RXfxJ2ikEt3ICh2Tx"); // Use your Stripe public key

export default function ClientPage() {
    const username = localStorage.getItem('username');
    const [showModal, setShowModal] = React.useState(false);  
    const [amount, setAmount] = React.useState(0);  // Amount to be paid
    return (
        <Elements stripe={stripePromise}>
        <div className="h-full flex flex-col h-screen w-screen pb-5">
            <div className="flex items-center justify-between p-4">
                <p className="text-lg font-bold w-1/3">Chats</p>
                <div className="w-1/3 flex justify-center">
                    <img src={ShopMeai} alt="ShopMeai" className="w-xs rounded-full object-cover" />
                </div>
                <div className="flex items-center gap-4 w-1/3 justify-end">   
                    <button className="border text-white px-4 py-2 rounded-lg flex gap-3 border-gray-300"
                        onClick={() => {
                            localStorage.removeItem('token');   
                            localStorage.removeItem('username');
                            window.location.href = '/login';
                        }}
                    >
                        <LogOut size={20} className="text-white" /> {/* Logout icon */}
                        <p>Logout</p>
                    </button>
                    <p className="text-gray-500">User: {username}</p>
                </div>
            </div>
            <div className="container max-w-3xl w-full h-full mx-auto">
                <ChatWindow activeUser={username} setAmount={setAmount} setShowModal={setShowModal} />
                <PaymentModal amount={amount} onClose={() => setShowModal(false)} show={showModal} />
            </div>
        </div>
        </Elements>
    )
}
