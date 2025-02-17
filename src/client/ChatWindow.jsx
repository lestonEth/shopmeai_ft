import React, { useEffect, useState, useRef } from "react";
import { SquareX } from "lucide-react";
import MessageInput from "./MessageInput";
import ShopMeai from "../assets/spmeai.png";
import io from "socket.io-client";

const server = "https://shopmeai-bc.onrender.com";
const socket = io(server);
console.log(socket);

export default function ChatWindow({ activeUser, setAmount, setShowModal }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const messagesEndRef = useRef(null); // Create a ref for the messages container
    const messagesContainerRef = useRef(null); // Ref for the messages container to track scroll position
    const [isUserScrolling, setIsUserScrolling] = useState(false); // State to track if the user is manually scrolling

    // Register user with their username
    socket.emit("register", activeUser);

    const [loading, setLoading] = useState(true);
    socket.emit('getMessages', activeUser); // Keep fetching messages for the active user

    socket.on("messagesHistory", (messages) => {
        setMessages(messages);
        setLoading(false); // Stop loading when messages are fetched
    });

    useEffect(() => {
        socket.emit('getMessages', activeUser); // Keep fetching messages for the active user

        socket.on("messagesHistory", (messages) => {
            setMessages(messages);
            setLoading(false); // Stop loading when messages are fetched
        });

        return () => {
            socket.off("messagesHistory"); // Clean up when component unmounts
        };
    }, []);  // Empty dependency array ensures this only runs once when the component mounts

    const sendMessage = () => {
        if (message.trim()) {
            // If message is non-empty, send the text message without uploading a file
            const newMessage = {
                sender: activeUser,
                recipient: "admin",
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
            fetch("https://shopmeai-bc.onrender.com", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    const newMessage = {
                        sender: activeUser,
                        recipient: "admin",
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
    
    const addProduct = () => {
        if (productName.trim() && productPrice.trim()) {
            const newMessage = {
                sender: activeUser,
                recipient: "admin",
                type: "product",    
                product: { name: productName, price: productPrice },
                file: null,
            };
            socket.emit("sendMessage", newMessage);
            setProductName("");
            setProductPrice("");
            setIsModalOpen(false);
        }
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isScrolledToBottom = container.scrollHeight === container.scrollTop + container.clientHeight;
            setIsUserScrolling(!isScrolledToBottom); // Track if the user is scrolling up
        }
    };

    useEffect(() => {
        if (!isUserScrolling) {
            // Only scroll to the bottom if the user isn't scrolling
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isUserScrolling]);

    return (
        <div className="h-full flex flex-col">
            <div
                className="flex-1 p-4 overflow-y-auto max-h-[78vh]"
                ref={messagesContainerRef} // Attach the scroll container ref
                onScroll={handleScroll} // Listen for scroll events
            >
                {loading ? (
                    <div>Loading previous messages...</div> // Simple loading message or spinner
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"} mb-2`}>
                            {msg.type === "text" && (
                                <div className="border p-2 rounded-lg max-w-xs">
                                    {msg.text}
                                </div>
                            )}
                            {msg.type === "product" && (
                                <div className="border p-4 rounded-lg flex flex-col w-xs text-center space-y-2">
                                    <p className="font-semibold">{msg.product?.name}</p>
                                    <p className="text-gray-300 text-xl text-bold">${parseFloat(msg.product?.price || 0).toFixed(2)}</p>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded"
                                        onClick={() => { setAmount(msg.product.price); setShowModal(true); }}
                                    >Buy</button>
                                </div>
                            )}
                            {msg.type === "file" && (
                                <div className="border p-4 rounded-lg max-w-xs text-center">
                                    {/* check if image */}
                                    {msg.file.name.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                        <img src={`${server}${msg.file.url}`} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
                                    ) : (
                                        <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            {msg.file.name}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
                {/* Add a ref at the bottom of the messages list */}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSendMessage={sendMessage} message={message} setMessage={setMessage} file={file} setFile={setFile} socket={socket} activeUser={activeUser} />

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
