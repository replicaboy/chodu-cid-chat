import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages ko import kar rahe hain
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ChatPage from './pages/ChatPage'; // Naya Chat Component

// Ek simple Protection function (Taaki bina login kiye koi chat na dekh sake)
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Default Route: Pehle Login par bhejo */}
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* 2. Khule Routes (Sab dekh sakte hain) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* 3. Protected Routes (Sirf Login ke baad dikhenge) */}
                <Route 
                    path="/chat" 
                    element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/admin" 
                    element={
                        <PrivateRoute>
                            <AdminPanel />
                        </PrivateRoute>
                    } 
                />

                {/* 4. Galat URL daalne par wapas Login par bhejo */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}