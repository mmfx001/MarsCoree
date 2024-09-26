import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [teacher, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Trim inputs
        const trimmedName = teacher.trim();
        const trimmedPassword = password.trim();
    
        // Validate inputs
        if (!trimmedName || !trimmedPassword) {
            setMessage('Iltimos, ism va parolni to\'ldiring');
            return;
        }
    
        try {
            // Fetch users data from the server
            const { data: users } = await axios.get('http://localhost:5001/teachers');
            
            // Find matching user
            const user = users.find(v => v.teacher === trimmedName && v.password === trimmedPassword);
            
            if (user) {
                // Store user in localStorage and navigate to the main page
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                
                // Clear form inputs and message
                setName('');
                setPassword('');
                setMessage('');
    
                // Update to navigate to the correct route
                navigate(`/teacher`);
            } else {
                // Display user not found message
                setMessage('Foydalanuvchi topilmadi');
            }
        } catch (error) {
            console.error('Xato:', error);
            setMessage('Tarmoq xatosi, qaytadan urinib ko\'ring');
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-cover px-4" style={{ backgroundImage: 'url("/path/to/background-image.jpg")' }}>
            <div className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Kirish</h2>
                
                {message && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg">
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ism</label>
                        <input
                            type="text"
                            value={teacher}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Ismingizni kiriting"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Parol</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Parolingizni kiriting"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
