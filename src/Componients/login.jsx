import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [teacher, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

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
            const { data: users } = await axios.get('https://shoopjson-2.onrender.com/api/teachers');

            // Find matching user
            const user = users.find(v => v.teacher === trimmedName && v.password === trimmedPassword);

            if (user) {
                // Store user in localStorage and navigate to the main page
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                // Clear form inputs and message
                setName('');
                setPassword('');
                setMessage('');

                // Navigate to the correct route
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
        <div className="bg-slate-800 w-full h-screen flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-8 w-full max-w-4xl flex flex-col md:flex-row items-center gap-6">
                
                {/* Astronaut Image */}
             

                {/* Login Form */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Xush Kelibsiz</h2>

                    {message && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Ism (Name) Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ism</label>
                            <input
                                type="text"
                                value={teacher}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
                                placeholder="Ismingizni kiriting    (Dilbek)"
                                required
                            />
                        </div>

                        {/* Parol (Password) Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parol</label>
                            <input
                                type="password "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150"
                                placeholder="Parolingizni kiriting   ( 1 )"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                        type="submit"
                        className={`w-full bg-orange-600 text-white py-3 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        ) : (
                            'Kirish'
                        )}
                    </button>
                    </form>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                    <img 
                        src="https://core.marsit.uz/img/austronaut.43cae203.png" 
                        alt="Astronaut" 
                        className="w-3/4 md:w-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
