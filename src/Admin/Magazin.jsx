import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const Magazin = () => {
    const [shopItems, setShopItems] = useState([]);
    const [shopHistory, setShopHistory] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({
        name: '',
        price: 0,
        quantity: 1,
        description: '',
        currency: 'USD',
        status: '',
        promotion: '',
        img: '',
    });

    // Komponent yuklanganda shopItems va shopHistory ni olish
    useEffect(() => {
        fetchShopItems();

        // `localStorage`dan tarixni olish
        const storedHistory = localStorage.getItem('shopHistory');
        if (storedHistory) {
            setShopHistory(JSON.parse(storedHistory));
        } else {
            fetchShopHistory();  // agar localStorageda tarix bo'lmasa, serverdan olish
        }
    }, []);

    const fetchShopItems = async () => {
        try {
            const response = await axios.get('https://shoopjson-2.onrender.com/api/shop');
            setShopItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Do\'kon mahsulotlarini olishda xatolik yuz berdi:', error);
            setShopItems([]);
        }
    };

    const fetchShopHistory = async () => {
        try {
            const response = await axios.get('https://shoopjson-2.onrender.com/api/shophistory');
            setShopHistory(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Do\'kon tarixini olishda xatolik yuz berdi:', error);
            setShopHistory([]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://shoopjson-2.onrender.com/api/shop/${id}`);
            fetchShopItems();
        } catch (error) {
            console.error('Mahsulotni o\'chirishda xatolik:', error.response?.data || error.message);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`https://shoopjson-2.onrender.com/api/shop/${id}`, updatedData);
            setEditingItem(null);
            fetchShopItems();
        } catch (error) {
            console.error('Mahsulotni yangilashda xatolik:', error);
        }
    };

    const handleAdd = async () => {
        try {
            await axios.post('https://shoopjson-2.onrender.com/api/shop', newItem);
            setNewItem({
                name: '',
                price: 0,
                quantity: 1,
                description: '',
                currency: 'USD',
                status: '',
                promotion: '',
                img: '',
            });
            fetchShopItems();
        } catch (error) {
            console.error('Yangi mahsulot qo\'shishda xatolik:', error);
        }
    };

    const handleEditChange = (field, value) => {
        setEditingItem((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleHistoryAction = async (id, action) => {
        try {
            // Tarixni yangilash
            const updatedHistory = shopHistory.map((history) =>
                history.id === id ? { ...history, status: action === 'tick' ? 'Bajarildi' : 'Muvaffaqiyatsiz' } : history
            );

            // LocalStorage'ga yangilangan tarixni saqlash
            localStorage.setItem('shopHistory', JSON.stringify(updatedHistory));

            // Holatni yangilash
            setShopHistory(updatedHistory);
        } catch (error) {
            console.error('Tarixni yangilashda xatolik:', error);
        }
    };



    return (
        <div className="w-full flex">
         <Sidebar/>   
        <div className="p-12 w-full font-sans bg-teal-50 min-h-screen">
            <h1 className="text-center text-5xl font-extrabold text-gray-800 mb-12">Do'kon</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full overflow-scroll h-screen">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Mahsulotlar</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                        <h3 className="text-2xl font-medium text-gray-700 mb-4">Yangi mahsulot qo'shish</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Mahsulot nomi</label>
                                <input
                                    type="text"
                                    placeholder="Mahsulot nomini kiriting"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Narxi</label>
                                <input
                                    type="number"
                                    placeholder="Narxni kiriting"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Soni</label>
                                <input
                                    type="number"
                                    placeholder="Mahsulot sonini kiriting"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Rasm URL</label>
                                <input
                                    type="text"
                                    placeholder="Rasm URL manzilini kiriting"
                                    value={newItem.img}
                                    onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                        <button
                            className="mt-6 bg-teal-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-teal-600 transition-all"
                            onClick={handleAdd}
                        >
                            Qo'shish
                        </button>
                    </div>
                    {shopItems.map((item) =>
                        editingItem && editingItem.id === item.id ? (
                            <div key={item.id} className="bg-gray-100 p-8 rounded-xl shadow-md mb-8">
                                <input
                                    type="text"
                                    value={editingItem?.name || ''}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    type="number"
                                    value={editingItem?.price || ''}
                                    onChange={(e) => handleEditChange('price', e.target.value)}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    type="number"
                                    value={editingItem?.quantity || ''}
                                    onChange={(e) => handleEditChange('quantity', e.target.value)}


                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    type="text"
                                    value={editingItem?.img || ''}
                                    onChange={(e) => handleEditChange('img', e.target.value)}
                                    className="w-3/4 max-w-md border border-gray-300 rounded-xl p-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => handleUpdate(editingItem.id, editingItem)}
                                        className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition-all"
                                    >
                                        Saqlash
                                    </button>
                                    <button
                                        onClick={() => setEditingItem(null)}
                                        className="bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-600 transition-all"
                                    >
                                        Bekor qilish
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key={item.id || item._id} className="bg-white rounded-xl shadow-lg p-6 mb-6 ">
                                <img
                                    src={item.img || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg mb-6"
                                />
                                <h3 className="text-2xl font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-lg text-gray-600">Narxi: ${item.price}</p>
                                <p className="text-lg text-gray-600">Soni: {item.quantity}</p>
                                <div className="mt-4 flex gap-6">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transition-all"
                                    >
                                        Tahrirlash
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id || item._id)}
                                        className="bg-red-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition-all"
                                    >
                                        O'chirish
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-2xl p-8 w-full">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Tarix</h2>
                    {shopHistory.map((history) => (
                        <div key={history.id} className="bg-gray-100 p-6 rounded-xl shadow-md mb-8">
                            <p className="text-xl text-gray-700 font-medium">Harakat: {history.action}</p>
                            <p className="text-lg text-gray-600">Sana: {new Date(history.date).toLocaleString()}</p>
                            <p className="text-lg text-gray-600">Holati: {history.status || 'Kutilmoqda'}</p>
                            <div className="mt-6 flex gap-6">
                                <button
                                    onClick={() => handleHistoryAction(history.id, 'tick')}
                                    className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition-all"
                                >
                                    Tasdiqlash
                                </button>
                                <button
                                    onClick={() => handleHistoryAction(history.id, 'cross')}
                                    className="bg-red-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition-all"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Magazin;