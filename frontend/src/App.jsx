import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

// Ek temporary chat screen jab tak asli chat na jud jaye
const Chat = () => <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Chat Screen 💬 (Jald aa raha hai...)</h2>;

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Agar koi direct website khelega, toh wo Login par jayega */}
                <Route path="/" element={<Navigate to="/login" />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    );
}