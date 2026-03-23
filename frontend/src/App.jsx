import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; 

// Socket connection
const socket = io(); 

// 🔊 Aapke 4 custom sounds ki list
const soundsList = [
  '/sounds/sound1.mp3', 
  '/sounds/sound2.mp3',
  '/sounds/sound3.mp3',
  '/sounds/sound4.mp3',
  '/sounds/sound5.mp3',
  '/sounds/sound6.mp3',
];

function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Database se purane messages load karna
    socket.on("load_old_messages", (messages) => {
      setChatHistory(messages);
    });

    // 2. Naya message aane par (Receiving sound hata diya gaya hai)
    socket.on("receive_message", (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    // 3. Clear chat logic
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

  // Jaise hi naya message aaye, niche scroll karein
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // 🔊 Random sound play karne ka function
  const playRandomSound = () => {
    try {
      if (soundsList.length === 0) return; 

      // 0 se 3 ke beech koi ek random number chunein
      const randomIndex = Math.floor(Math.random() * soundsList.length);
      const randomSoundPath = soundsList[randomIndex];
      
      // Local path se audio play karein
      const audio = new Audio(randomSoundPath);
      audio.play().catch((err) => console.log("Sound play error:", err));
    } catch (error) {
      console.log("Sound error:", error);
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        text: currentMessage,
        senderId: socket.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      socket.emit("send_message", messageData);
      setCurrentMessage(""); 
      
      // 🔊 Message bhejne par aawaz aayegi
      playRandomSound();
    }
  };

  const clearChat = () => {
    if (window.confirm("Kya aap sach mein saari chat delete karna chahte hain? 💣")) {
      socket.emit("clear_chat");
    }
  };

  return (
    <div className="app-wrapper">
      
      <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* 🖼️ Aapki custom Profile Picture */}
          <img 
            src="/profile.jpeg" 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }}
          />

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
