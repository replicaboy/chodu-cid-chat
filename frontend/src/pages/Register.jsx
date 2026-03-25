import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend URL (Port 3000) par data bhejna
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password
            });
            alert('Account ban gaya! 🎉 Ab aap login kar sakte hain.');
            window.location.href = '/login'; // Success ke baad login page par bhejna
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Kuch galat hua'));
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            <h2>Naya Account Banayein 👤</h2>
            <form onSubmit={handleRegister} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '30px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Full Name:</strong></label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '250px', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Email:</strong></label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '250px', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Password:</strong></label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '250px', padding: '8px', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    Register Karein
                </button>
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Pehle se account hai? <Link to="/login" style={{ color: '#007bff' }}>Login karein</Link>
                </p>
            </form>
        </div>
    );
}
