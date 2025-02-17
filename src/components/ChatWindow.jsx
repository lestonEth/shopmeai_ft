import React, { useState, useEffect, useRef } from "react";
import Topbar from "./Topbar";
import { SquareX } from "lucide-react";
import MessageInput from "./MessageInput";
import io from 'socket.io-client';

// Connect to the backend socket
const server = "https://shopmeai-bc.onrender.com";
const socket = io('https://shopmeai-bc.onrender.com'); // Adjust to your server's URL

export default function ChatWindow({ activeUser }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [isTyping, setIsTyping] = useState(false);
 
    const messagesEndRef = useRef(null); // Create a ref for the messages container

    // Listen for incoming messages
    socket.on('newMessage', (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    socket.on('messagesHistory', (history) => {
        setMessages(history);
    });

    // Listen for new messages continuously, regardless of active user change
    socket.emit('getMessages', activeUser); // Keep fetching messages for the active user

    const handleMessaging = () => {
         // Fetch previous messages for the active user
         if (activeUser && activeUser !== "admin") {
            socket.emit('getMessages', activeUser);  // Pass activeUser as the recipient
        }


        socket.on('userTyping', (data) => {
            // Set typing state to true when another user is typing
            if (data.username !== activeUser) {
                setIsTyping(true);
            }
        });

        socket.on('messagesHistory', (history) => {
            setMessages(history);
        });

        // Listen for new messages continuously, regardless of active user change
        socket.emit('getMessages', activeUser); // Keep fetching messages for the active user

        // Cleanup on component unmount
        return () => {
            socket.off('newMessage');
            socket.off('messagesHistory');
            socket.off('userTyping');
        };
    };

    // Fetch message history once when the component mounts
    useEffect(() => {
        setIsTyping(false); // Reset typing indicator when the component mounts
        handleMessaging();
    }, [activeUser]);
    
    // Scroll to the bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim()) {
            // If message is non-empty, send the text message without uploading a file
            const newMessage = {
                sender: "admin",
                recipient: activeUser,
                type: "text",
                text: message,
                file: null, // No file attached
            };
            socket.emit("sendMessage", newMessage);
            setMessage(""); // Clear the message input
        }
    
        if (file) {
            // If a file is selected, upload it
            const formData = new FormData();
            formData.append("file", file);
    
            // Send the file to the server first
            fetch("https://shopmeai-bc.onrender.com/upload", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    const newMessage = {
                        sender: "admin",
                        recipient: activeUser,
                        type: "file",
                        text: message, // You can keep the text or make it empty if no text is provided
                        file: { name: file.name, url: data.fileUrl }, // Use the file URL received from the server
                    };
    
                    socket.emit("sendMessage", newMessage); // Send the file message
                    setMessage(""); // Clear message input
                    setFile(null); // Clear the file after sending
                })
                .catch(error => console.error("Error uploading file:", error));
        }
    };

    const handleTyping = () => {
        if (message.trim()) {
            socket.emit("typing", activeUser);  // Emit typing event when user types
        } else {
            socket.emit("stopTyping", activeUser);  // Optionally, you can emit a stop typing event when the user stops typing
        }
    };

    const addProduct = () => {
        if (productName.trim() && productPrice.trim()) {
            console.log("Product:", productName, productPrice);
            const productMessage = {
                sender: "admin",
                recipient: activeUser,
                product: { name: productName, price: productPrice },
                type: "product"
            };
            
            socket.emit('sendMessage', productMessage); // Send product as a message
            setProductName("");
            setProductPrice("");
            setIsModalOpen(false);
        }
    };

    socket.on('stopTyping', (data) => {
        // Set typing state to true when another user is typing
        if (data.username !== activeUser) {
            setIsTyping(true);
        }
    });


    return (
        <div className="h-full flex flex-col">
            <Topbar username={activeUser} onAddProduct={() => setIsModalOpen(true)} />

            <div className="flex-1 p-4 overflow-y-auto" id="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"} mb-2`}>
                        {msg.type === "text" && (
                            <div className="border p-2 rounded-lg max-w-xs">
                                {msg.text}
                            </div>
                        )}
                        {msg.type === "product" && (

                            <div className="border p-4 rounded-lg flex flex-col max-w-xs text-center space-y-2">
                                <p className="font-semibold">{msg.product?.name}</p>
                                <p className="font-semibold">${msg.product?.price}</p>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">Buy</button>
                            </div>
                        )}
                        {msg.type === "file" && (
                            <div className="border p-4 rounded-lg max-w-xs text-center">
                                {msg.file.name.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                    <img src={`${server}${msg.file.url}`}  alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
                                ) : (
                                    <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        {msg.file.name}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && activeUser !== "admin" && (
                    <div className="text-gray-500 italic">
                        {activeUser} is typing...
                    </div>
                )}
                {/* Add a ref at the bottom of the messages list */}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput 
                onSendMessage={sendMessage} 
                message={message} 
                setMessage={setMessage} 
                file={file} 
                setFile={setFile} 
                onTyping={handleTyping}
            />

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#444] p-6 rounded-lg w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold mb-4">Add Product</h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <SquareX size={24} />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full p-2 border rounded mb-2"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Product Price"
                            className="w-full p-2 border rounded mb-2"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 rounded">Cancel</button>
                            <button onClick={addProduct} className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
