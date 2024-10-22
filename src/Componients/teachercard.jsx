import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './saidbar';

const TeacherCard = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingData, setRatingData] = useState([]);

    // Fetch rating data
    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                const response = await axios.get("https://shoopjson-2.onrender.com/api/rating");
                setRatingData(response.data || []);
            } catch (error) {
                setError("Reyting ma'lumotlarini olishda xato.");
            }
        };
        fetchRatingData();
    }, []);

    // Fetch teacher data based on logged-in user
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                if (!loggedInUser) {
                    setError('Foydalanuvchi tizimga kirmagan');
                    return;
                }
                const response = await axios.get(`https://shoopjson-2.onrender.com/api/teachers/${loggedInUser.id}`);
                setTeacher(response.data);
            } catch (error) {
                setError("O'qituvchi ma'lumotlarini olishda xato.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, []);

    // Sort rating data by the 'Umumiy' score
    const sortedRatingData = useMemo(() => {
        return [...ratingData].sort((a, b) => b.Umumiy - a.Umumiy);
    }, [ratingData]);

    // Handle loading state
    if (loading) {
        return <p className="text-center mt-12">Yuklanmoqda...</p>;
    }

    // Handle errors
    if (error) {
        return <p className="text-center mt-12 text-red-500">{error}</p>;
    }

    // Handle missing teacher data
    if (!teacher) {
        return <p className="text-center mt-12 text-red-500">O'qituvchi topilmadi</p>;
    }

    // Extracting groups
    const groups = teacher.groups || []; // Assuming 'groups' is an array within the teacher object

    // Handle group selection
    const handleClick = (group) => {
        localStorage.setItem('selectedGroupId', group.groupNumber);
        console.log('Selected Group ID:', group.groupNumber);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col w-full ml-24 mt-14">
                <div className="p-6 bg-gray-50 rounded-2xl shadow-xl w-full">
                    <h1 className="text-3xl font-bold mb-4">⭕ Guruhlar</h1>
                    <hr className="mb-6 mt-5" />
                    {groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {groups.map((group) => (
                                <div key={group.groupNumber} className="bg-white shadow-lg rounded-lg p-4 max-w-xs mb-7">
                                    <div className="w-full p-7 bg-yellow-300 flex flex-col items-center justify-center rounded-lg">
                                        <h2 className="text-4xl text-white font-bold mb-2 text-center">{group.groupNumber}</h2>
                                        <h1 className="text-2xl text-white font-bold text-center">{teacher.teacher}</h1>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-3">
                                        <p className="w-full flex items-center justify-between text-xl font-semibold">
                                            <span className="text-base">Talabalar</span> {group.studentscount}
                                        </p>
                                        <p className="w-full flex items-center justify-between text-xl font-semibold">
                                            <span className="text-base">Vaqt</span> {group.time}
                                        </p>
                                        <button onClick={() => handleClick(group)}>
                                            <Link
                                                to="/coins"
                                                className="px-6 w-32 rounded-md py-1 bg-green-600 text-white text-lg font-semibold text-center inline-block"
                                            >
                                                Tekshirish
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-12 text-red-500">Guruhlar topilmadi</p>
                    )}
                </div>

                {/* Rating Section */}
                <div className="w-full bg-gray-50 rounded-lg shadow-lg p-5 mt-10">
                    <h1 className="text-3xl font-semibold mb-4">⭕ O'qituvchi reytingi</h1>
                    <hr />
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-lg rounded-lg">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
                                <tr>
                                    <th className="py-3 px-6 text-left">#</th>
                                    <th className="py-3 px-6 text-left">Mentor</th>
                                    <th className="py-3 px-6 text-center">QA(40)</th>
                                    <th className="py-3 px-6 text-center">Ketganlar soni</th>
                                    <th className="py-3 px-6 text-center">Retention Score(20)</th>
                                    <th className="py-3 px-6 text-center">Space Usage</th>
                                    <th className="py-3 px-6 text-center">Umumiy</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                {sortedRatingData.length > 0 ? (
                                    sortedRatingData.map((rating, index) => (
                                        <tr key={rating.id || index} className="border-b border-gray-200 hover:bg-orange-500 transition-colors duration-300">
                                            <td className="py-3 px-6 text-left">
                                                <span className="font-medium">{index + 1}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span className="text-blue-500">{rating.name}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full text-xs">{rating.QA}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-teal-100 text-teal-600 py-1 px-3 rounded-full text-xs">{rating.Ketganlar}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs">{rating.Retention}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-purple-100 text-purple-600 py-1 px-3 rounded-full text-xs">{rating.Usage}</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs">{rating.Umumiy}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-3 px-6 text-center text-red-500">
                                            Reyting ma'lumotlari topilmadi
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
