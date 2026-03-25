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
// Backend se login verify karwana (Short URL ke sath)
const res = await axios.post('/api/auth/login', { email, password });

// Sabse zaroori: Backend se milne wala data save karna
localStorage.setItem('token', res.data.token);
localStorage.setItem('userName', res.data.user.name);
localStorage.setItem('role', res.data.user.role);

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/chat');
            }
        } catch (error) {
            alert('Galti: ' + (error.response?.data?.message || 'Email ya Password galat hai'));
        }
    };

    return (
        <div style={{ backgroundColor: '#ece5dd', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '350px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#075e54', textAlign: 'center' }}>Chodu Cid Chat</h2>
                <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                    <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px' }} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>Account nahi hai? <Link to="/register" style={{ color: '#075e54', fontWeight: 'bold' }}>Register</Link></p>
            </div>
        </div>
    );
}
