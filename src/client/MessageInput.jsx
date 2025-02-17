import React, { useEffect, useState } from "react";
import { Paperclip, Mic, SendHorizonal, X } from "lucide-react";

export default function MessageInput({ onSendMessage, message, setMessage, file, setFile, socket, activeUser }) {
    const [isListening, setIsListening] = useState(false);

    // Handle file upload
    const handleAttachment = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*,video/*,application/pdf"; // Accept images, videos, PDFs
        fileInput.onchange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
            }
        };
        fileInput.click();
    };

    // Remove attachment
    const removeAttachment = () => {
        setFile(null);
    };

    // Handle microphone recording and speech recognition
    const handleMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    };

    // Listen to Enter key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                onSendMessage();
            }
        };
        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [onSendMessage]);

    const handleTyping = () => {
        if (message.trim() !== "") {
            socket.emit("typing", activeUser);  // Send the typing event to the server
        } else {
            socket.emit("stopTyping", activeUser);  // Send the stop typing event to the server
        }
    };

    return (
        <div className="p-4 bg-[#2f2f2f] border-t border-gray-600 flex flex-col space-y-2">
            {/* File Preview */}
            {file && (
                <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
                    {file.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                        <span className="text-white">{file.name}</span>
                    )}
                    <button onClick={removeAttachment} className="text-red-500">
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="flex space-x-2">
                {/* Attachment Button */}
                <button onClick={handleAttachment} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <Paperclip size={24} />
                </button>

                {/* Message Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();  // Call the typing handler
                    }}
                    placeholder="Type a message or use the mic..."
                    className="flex-1 p-2 rounded-lg border border-gray-400 mx-4 bg-[#1e1e1e] text-white"
                />

                {/* Microphone Button */}
                <button onClick={handleMic} className={`px-4 py-2 rounded-lg ${isListening ? "bg-red-500" : "bg-gray-500"} text-white`}>
                    <Mic size={24} />
                </button>

                {/* Send Button */}
                <button onClick={onSendMessage} className="bg-green-800 text-white px-4 py-2 rounded-lg">
                    <SendHorizonal size={24} />
                </button>
            </div>
        </div>
    );
}
