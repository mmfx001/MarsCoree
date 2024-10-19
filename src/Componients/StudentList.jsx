import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChildSidebar from './childsaidbar';

const StudentList = () => {
    const { groupId } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amounts, setAmounts] = useState({});
    const [groupCoins, setGroupCoins] = useState(0);
    const [teacherData, setTeacherData] = useState(null);
    const refreshRef = useRef(null);

    const fetchStudents = async () => {
        try {
            const localGroupId = JSON.parse(localStorage.getItem('selectedGroupId'));

            if (!localGroupId) {
                setError('Foydalanuvchi tizimga kirmagan');
                return;
            }

            const response = await axios.get('https://shoopjson-2.onrender.com/api/students');
            const filteredStudents = response.data.filter(student => student.group == localGroupId);
            console.log('Filtrlangan talabalar:', filteredStudents);
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Ma\'lumotlarni olishda xato:', error);
            setError('Ma\'lumotlarni olishda xato');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeacher = async () => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

            if (!loggedInUser) {
                setError('Foydalanuvchi tizimga kirmagan');
                return;
            }

            const response = await axios.get(`https://shoopjson-2.onrender.com/api/teachers/${loggedInUser.id}`);
            setTeacherData(response.data);
        } catch (error) {
            console.error('O\'qituvchi ma\'lumotlarini olishda xato:', error);
            setError('O\'qituvchi ma\'lumotlarini olishda xato');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchTeacher();
    }, []);

    const handleAmountChange = (id, value) => {
        setAmounts(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (student) => {
        const amount = parseInt(amounts[student.id], 10);
        if (!isNaN(amount) && amount > 0) {
            if (groupCoins >= amount) {
                try {
                    const updatedStudent = {
                        ...student,
                        balance: student.balance + amount,
                        coins: student.coins + amount,
                    };
                    const updatedGroupCoins = groupCoins - amount;

                    await axios.put(`https://shoopjson-2.onrender.com/api/students/${student.id}`, updatedStudent);
                    await axios.put(`https://shoopjson-2.onrender.com/api/teachers/${teacherData.id}`, {
                        ...teacherData,
                        groups: [{ ...teacherData.groups[0], coins: updatedGroupCoins }]
                    });

                    setStudents(students.map(s => (s.id === student.id ? updatedStudent : s)));
                    setGroupCoins(updatedGroupCoins);
                    setAmounts(prev => ({ ...prev, [student.id]: '' }));
                } catch (error) {
                    alert("Balansni yangilashda xato: " + error.message);
                }
            } else {
                alert('Yetarli coins mavjud emas!');
            }
        } else {
            alert('Iltimos, to\'g\'ri son kiriting.');
        }
    };

    const [showInput, setShowInput] = useState({});
    const toggleInput = (id) => {
        setShowInput(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Davomatni yangilash funksiyasi
    const handleAttendanceChange = async (student) => {
        if (student.tolov < 90833) {
            alert('Tolov miqdori 90833 dan kam. O\'zgartirish mumkin emas!');
            return;
        }

        const updatedStudent = {
            ...student,
            last: new Date().toLocaleDateString(),
            tolov: student.tolov - 90833 // tolovni yangilang
        };

        try {
            await axios.put(`https://shoopjson-2.onrender.com/api/students/${student.id}`, updatedStudent);
            setStudents(students.map(s => (s.id === student.id ? updatedStudent : s)));
        } catch (error) {
            alert("Davomatni yangilashda xato: " + error.message);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await fetchStudents();
        await fetchTeacher();
    };

    if (loading) {
        return <p className="text-center mt-12">Yuklanmoqda...</p>;
    }

    if (error) {
        return <p className="text-center mt-12 text-red-500">{error}</p>;
    }

    if (students.length === 0) {
        return <p className="text-center mt-12">Guruhda o'quvchilar mavjud emas.</p>;
    }

    return (
        <div className='flex w-full h-screen bg-white'>
            <ChildSidebar />
            <div className="container h-screen p-2 w-full bg-gray-100 flex justify-center items-center">
                <div className="overflow-x-auto w-[75%] bg-white shadow-lg rounded-3xl p-5">
                    <div className='flex items-center w-full justify-between'>
                        <h1 className='text-4xl font-semibold mb-12'>⭕{groupId}</h1>
                        <div className='flex flex-col items-center'>
                            <button onClick={handleRefresh} ref={refreshRef} className='py-1 px-4 mb-12 bg-emerald-400 text-white font-semibold rounded-2xl'> 🔃Yangilash</button>
                        </div>
                    </div>
                    <table className="w-full overflow-hidden">
                        <thead>
                            <tr className="text-black bg-gray-100 uppercase w-full text-sm leading-normal">
                                <th className="py-4 px-6 w-36 text-left shadow-r-gray">Studentlar</th>
                                <th className="py-4 px-6 text-left">League</th>
                                <th className="py-4 px-6 text-left">Coins</th>
                                <th className="py-4 px-6 text-left">Last</th>
                                <th className="py-4 px-6 w-full text-right flex items-center gap-3">Coin chegarasi <p className='text-orange-500 text-right text-xs'>(Gacha: {groupCoins})</p></th>
                                <th className="py-4 px-6 text-right">Davomat</th> {/* Yangilangan ustun */}
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {students.map((student) => (
                                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        <span className="font-medium">{student.name}</span>
                                    </td>
                                    <td className="py-3 px-6 text-left">{student.league}</td>
                                    <td className="py-3 px-6 text-left">{student.coins}</td>
                                    <td className="py-3 px-6 text-left">{student.last}</td>
                                    <td className="py-3 px-6 text-right flex items-center gap-3">
                                        <button onClick={() => toggleInput(student.id)} className="bg-blue-500 text-white py-1 px-4 rounded">Add Coin</button>
                                        {showInput[student.id] && (
                                            <div className='flex items-center'>
                                                <input
                                                    type="number"
                                                    value={amounts[student.id] || ''}
                                                    onChange={(e) => handleAmountChange(student.id, e.target.value)}
                                                    placeholder="Miqdor..."
                                                    className="border-2 border-gray-300 rounded-lg px-2"
                                                />
                                                <button onClick={() => handleSubmit(student)} className="bg-green-500 text-white py-1 px-4 rounded">Jo'natish</button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-right"> {/* Davomat tugmasi */}
                                        <button onClick={() => handleAttendanceChange(student)} className="bg-orange-500 text-white py-1 px-4 rounded">Davomat</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
