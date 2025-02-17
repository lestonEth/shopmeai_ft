import React, {useState, useMemo, act } from 'react'
import Container from '../components/Container';
import ChatWindow from '../components/ChatWindow';
import Home from '../components/Home';
import Settings from '../components/Settings';

export default function AdminPage() {
    // memo active tab
    const [activeTab, setActiveTab] = useState("chats");
    const [activeUser, setActiveUser] = useState("JimLeston");

    return (
        <Container activeTab={activeTab} setActiveTab={setActiveTab} activeUser={activeUser} setActiveUser={setActiveUser}>
            {activeTab === "chats" && <ChatWindow activeUser={activeUser} />}
            {activeTab === "home" && <Home activeUser={activeUser} setActiveUser={setActiveUser} />}
            {activeTab === "settings" && <Settings activeUser={activeUser} setActiveUser={setActiveUser} />}
        </Container>
    )
}
