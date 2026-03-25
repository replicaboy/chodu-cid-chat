import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Backend se login verify karwana
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            // 1. Browser ki memory (LocalStorage) mein Token aur Details save karna
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userName', response.data.name);

            alert(`Welcome back, ${response.data.name}! 👋`);

            // 2. Role check karke sahi page par bhejna
            if (response.data.role === 'admin') {
                navigate('/admin'); // Admin ko dashboard par
            } else {
                navigate('/chat'); // Normal user ko chat screen par
            }
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Galat Email ya Password'));
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            <h2>Login Karein 🔑</h2>
            <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '30px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Email:</strong></label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '250px', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Password:</strong></label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '250px', padding: '8px', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    Login
                </button>
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Account nahi hai? <Link to="/register" style={{ color: '#28a745' }}>Register karein</Link>
                </p>
            </form>
        </div>
    );
}
