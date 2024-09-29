import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './saidbar';

const TeacherCard = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingData, setRatingData] = useState([]); // State to store rating data

    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                const response = await axios.get("http://localhost:5001/rating");
                setRatingData(response.data || []); // Store fetched rating data
            } catch (error) {
                console.error("Error fetching rating data", error);
            }
        };
        fetchRatingData();
    }, []);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                // Get logged-in user data from localStorage
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                console.log(loggedInUser);

                if (!loggedInUser) {
                    setError('Foydalanuvchi tizimga kirmagan');
                    return;
                }

                // Fetch teacher data
                const response = await axios.get(`http://localhost:5001/teachers/${loggedInUser.id}`);
                setTeacher(response.data);
            } catch (error) {
                console.error('O\'qituvchi ma\'lumotlarini olishda xato:', error);
                setError('O\'qituvchi ma\'lumotlarini olishda xato');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, []);

    // Sorting rating data by the 'Umumiy' score
    const sortedRatingData = [...ratingData].sort((a, b) => b.Umumiy - a.Umumiy);

    if (loading) {
        return <p className="text-center mt-12">Yuklanmoqda...</p>;
    }

    if (error) {
        return <p className="text-center mt-12 text-red-500">{error}</p>;
    }

    if (!teacher) {
        return <p className="text-center mt-12 text-red-500">O'qituvchi topilmadi</p>;
    }

    // Accessing groups correctly based on your provided JSON structure
    const groups = Object.keys(teacher).reduce((acc, key) => {
        if (key !== 'id' && key !== 'teacher' && key !== 'password' && key !== 'students' && key !== 'groupcount' && key !== 'level') {
            acc[key] = teacher[key]; // Add only group-related entries
        }
        return acc;
    }, {});

    const handleClick = (groupId) => {
        // Save the selected group ID to localStorage
        localStorage.setItem('selectedGroupId', groupId);
        console.log('Selected Group ID:', groupId);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className='flex flex-col w-full ml-24 mt-14 '>
                <div className="flex-1 p-6  w-full">
                    <div className='p-6 bg-gray-50 w-full rounded-2xl shadow-xl'>
                        <h1 className="text-3xl font-bold mb-4">⭕ Guruhlar</h1>
                        <hr className='mb-6 mt-5' />
                        {Object.keys(groups).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(groups).map((groupId) => (
                                    <div key={groupId} className="bg-white shadow-lg rounded-lg p-4 max-w-xs mb-7">
                                        {Array.isArray(groups[groupId]) ? ( // Ensure groups[groupId] is an array
                                            groups[groupId].map((group, index) => (
                                                <div key={index} className="mb-4">
                                                    <div className='w-full p-7 bg-yellow-300 flex flex-col items-center justify-center rounded-lg'>
                                                        <h2 className="text-4xl text-white font-bold mb-2 text-center">{groupId}</h2>
                                                        <h1 className="text-2xl text-white font-bold text-center">{teacher.teacher}</h1>
                                                    </div>
                                                    <div className='flex flex-col gap-4 mt-3'>
                                                        <p className='w-full flex items-center justify-between text-xl font-semibold'>
                                                            <span className='text-base'>Talabalar</span> {group.studentscount}
                                                        </p>
                                                        <p className='w-full flex items-center justify-between text-xl font-semibold'>
                                                            <span className='text-base'>Vaqt</span> {group.time}
                                                        </p>
                                                        <button onClick={() => handleClick(groupId)}>
                                                            <Link to={`/coins`} className='px-6 w-32 rounded-md py-1 bg-green-600 text-white text-lg font-semibold text-center inline-block'>
                                                                Tekshirish
                                                            </Link>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-red-500">Guruhlar ma'lumotlari noto'g'ri</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center mt-12 text-red-500">Guruhlar topilmadi</p>
                        )}
                    </div>
                </div>

                <div className='w-full bg-gray-50 rounded-lg shadow-lg p-5 flex flex-col gap-5'>
                    <h1 className='text-3xl font-semibold'>⭕ Oqituvchi reytingi</h1>
                    <hr />
                    <div>
                        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
                                <tr>
                                    <th className="py-3 px-6 text-left">#</th>
                                    <th className="py-3 px-6 text-left">Mentor</th>
                                    <th className="py-3 px-6 text-center">QA(40) Audit</th>
                                    <th className="py-3 px-6 text-center">Ketganlar soni</th>
                                    <th className="py-3 px-6 text-center">Retention Score(20)</th>
                                    <th className="py-3 px-6 text-center">Space Usage</th>
                                    <th className="py-3 px-6 text-center">Umumiy</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                {sortedRatingData.length > 0 ? (
                                    sortedRatingData.map((rating, index) => (
                                        <tr key={rating.id} className="border-b border-gray-200 hover:bg-orange-500 transition-colors duration-300">
                                            <td className="py-3 px-6 text-left">
                                                <span className="font-medium">{index + 1}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span className="text-blue-500">{rating.name}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full text-xs">
                                                    {rating.QA}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-teal-100 text-teal-600 py-1 px-3 rounded-full text-xs">
                                                    {rating.Ketganlar}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs">
                                                    {rating.Retention}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-purple-100 text-purple-600 py-1 px-3 rounded-full text-xs">
                                                    {rating.Usage}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs">
                                                    {rating.Umumiy}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center">
                                            Ma'lumotlar topilmadi
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCard;
