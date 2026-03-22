import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; 

// Socket connection
const socket = io(); 

// Pop notification sound effect
const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');

function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Niche scroll karne ka function
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Database se purane messages aane par
    socket.on("load_old_messages", (messages) => {
      setChatHistory(messages);
    });

    // 2. Naya message aane par
    socket.on("receive_message", (data) => {
      setChatHistory((prev) => [...prev, data]);

      // Agar kisi aur ne bheja hai toh sound play karo
      if (data.senderId !== socket.id) {
        popSound.play().catch((err) => console.log("Sound play error:", err));
      }
    });

    // 3. Jab koi clear chat button dabaye toh screen saaf kar do
    socket.on("chat_cleared", () => {
      setChatHistory([]);
    });

    // Cleanup
    return () => {
      socket.off("load_old_messages");
      socket.off("receive_message");
      socket.off("chat_cleared");
    };
  }, []);

  // Jab bhi naya message aaye, apne aap niche scroll karo
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        text: currentMessage,
        senderId: socket.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      socket.emit("send_message", messageData);
      setCurrentMessage(""); 

      // Khud message bhejne par bhi sound play karo
      popSound.currentTime = 0; 
      popSound.play().catch((err) => console.log("Sound play error:", err));
    }
  };

  const clearChat = () => {
    // Delete karne se pehle ek warning aayegi
    if (window.confirm("Kya aap sach mein saari chat delete karna chahte hain? 💣")) {
      socket.emit("clear_chat");
    }
  };

  return (
    <div className="app-wrapper">

      {/* Naya Header jisme Clear Button lagaya hai */}
      <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar">👤</div>
          <div>Chodu Cid Chat</div>
        </div>
        <button 
          onClick={clearChat} 
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          🗑️ Clear
        </button>
      </div>

      <div className="chat-window">
        {chatHistory.map((msg, index) => {
          const isMe = msg.senderId === socket.id;
          return (
            <div key={index} className={`message-container ${isMe ? 'me' : 'other'}`}>
              <div className="message-bubble">
                {msg.text}
                <span className="timestamp">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} /> 
      </div>

      <div className="input-area">
        <input 
          type="text" 
          value={currentMessage}
          placeholder="Type a message..." 
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;