import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

// Backend ka current URL
const socket = io();

// 🎵 Sounds (Jo apne previous turn mein set kiye the)
const soundFiles = [
    '/sounds/sound1.mp3',
    '/sounds/sound2.mp3',
    '/sounds/sound3.mp3',
    '/sounds/sound4.mp3',
    '/sounds/sound5.mp3',
    '/sounds/sound6.mp3',
    
];

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const userName = localStorage.getItem('userName') || 'User';
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    useEffect(() => {
        socket.on('load_old_messages', (data) => setChat(data));
        socket.on('receive_message', (data) => setChat((prev) => [...prev, data]));
        socket.on('chat_cleared', () => setChat([])); 

        return () => {
            socket.off('load_old_messages');
            socket.off('receive_message');
            socket.off('chat_cleared');
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const playRandomSound = () => {
        const randomIndex = Math.floor(Math.random() * soundFiles.length);
        const audio = new Audio(soundFiles[randomIndex]);
        audio.play().catch(e => console.log("Awaaz play nahi hui:", e)); 
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msgData = { text: message, senderId: userName, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
            socket.emit('send_message', msgData);
            setMessage('');
            playRandomSound(); // 🎵 Sound play karein
        }
    };

    const handleClearChat = () => {
        const confirmDelete = window.confirm("⚠️ Kya aap sach mein saari chat udana chahte hain? (Database se bhi delete ho jayegi)");
        if (confirmDelete) {
            socket.emit('clear_chat'); 
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: '#d1d7db', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial' }}>
            <div style={{ width: '100%', maxWidth: '600px', height: '90vh', backgroundColor: '#ece5dd', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                
                {/* Chat Header */}
                <div style={{ backgroundColor: '#075e54', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        
                        {/* 🖼️ Yahan humne Placeholder '👤' ko hata kar Nayi DP lagayi hai */}
                        <img 
                            src="/profile.jpeg" // public folder se image relative path se uthayi
                            alt="Profile" 
                            style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', // use gol karne ke liye
                                objectFit: 'cover' // agar image rectangular ho toh stretch na ho
                            }} 
                        />
                        
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Chodu Cid Chat</h3>
                            <span style={{ fontSize: '12px', color: '#dcf8c6' }}>{userName} (Online)</span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleClearChat} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            🗑️ Clear All
                        </button>
                        <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chat.map((msg, index) => {
                        const isMe = msg.senderId === userName;
                        return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                {!isMe && <span style={{ fontSize: '11px', color: '#555', marginBottom: '2px', marginLeft: '5px' }}>{msg.senderId}</span>}
                                <div style={{ 
                                    backgroundColor: isMe ? '#dcf8c6' : '#ffffff', 
                                    padding: '8px 12px', 
                                    borderRadius: '10px', 
                                    maxWidth: '70%', 
                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                    borderTopRightRadius: isMe ? '0px' : '10px',
                                    borderTopLeftRadius: isMe ? '10px' : '0px',
                                    wordWrap: 'break-word'
                                }}>
                                    <span style={{ fontSize: '14px', color: '#303030' }}>{msg.text}</span>
                                    <span style={{ fontSize: '10px', color: '#999', marginLeft: '10px', float: 'right', marginTop: '5px' }}>{msg.time}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Message Input Area */}
                <form onSubmit={sendMessage} style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Type a message" 
                        style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', outline: 'none', fontSize: '14px' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#00a884', color: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                        ➤
                    </button>
                </form>

            </div>
        </div>
    );
}