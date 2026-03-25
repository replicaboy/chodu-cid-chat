import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                                
                // Token ko header mein bhej kar data mangwana
                const res = await axios.get('/api/auth/admin-dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data.users);
            } catch (err) {
                setError(err.response?.data?.message || 'Network Error!');
            }
        };
        fetchUsers();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'Arial' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #075e54', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2 style={{ color: '#075e54', margin: 0 }}>👑 Admin Control Panel</h2>
                    <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>

                {error ? <p style={{ color: 'red' }}>{error}</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#075e54', color: 'white' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Naam</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{u.name}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{u.email}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        <span style={{ backgroundColor: u.role === 'admin' ? '#28a745' : '#17a2b8', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}