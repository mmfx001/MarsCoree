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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupId = JSON.parse(localStorage.getItem('selectedGroupId')); // Foydalanuvchini olish

                console.log(groupId);

                if (!groupId) {
                    setError('Foydalanuvchi tizimga kirmagan');
                    return;
                }

                const studentsResponse = await axios.get('http://localhost:5001/students');
                const filteredStudents = studentsResponse.data.filter(student => student.group == groupId);
                setStudents(filteredStudents);
                console.log(filteredStudents);


            } catch (error) {
                console.error('Ma\'lumotlarni olishda xato:', error);
                setError('Ma\'lumotlarni olishda xato');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [groupId]);

    const fetchStudentsAndGroupCoins = async (teacherId) => {
        try {
            const response = await axios.get('http://localhost:5001/students');
            const filteredStudents = response.data.filter(student => student.group === groupId);
            setStudents(filteredStudents);

            if (!teacherId) {
                throw new Error("O'qituvchi ma'lumotlari topilmadi.");
            }

            const teacherResponse = await axios.get(`http://localhost:5001/teachers/${teacherId}`);
            const groupData = teacherResponse.data[groupId] && teacherResponse.data[groupId].length > 0
                ? teacherResponse.data[groupId][0]
                : null;

            if (!groupData) {
                throw new Error("Guruh ma'lumotlari topilmadi.");
            }

            setGroupCoins(parseInt(teacherData.groupId.coins) || 600);
           
        } catch (error) {
            setError("O'quvchilar ma'lumotlarini olishda xato: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (teacherData) {
            fetchStudentsAndGroupCoins(teacherData.id);
        }
    }, [teacherData]);

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

                    await axios.put(`http://localhost:5001/students/${student.id}`, updatedStudent);
                    await axios.put(`http://localhost:5001/teachers/${teacherData.id}`, {
                        ...teacherData,
                        [groupId]: [{ ...teacherData[groupId][0], coins: updatedGroupCoins }]
                        
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
console.log(groupCoins);

    const [showInput, setShowInput] = useState({});
    const [showDateButtons, setShowDateButtons] = useState({});

    const toggleInput = (id) => {
        setShowInput(prev => ({ ...prev, [id]: !prev[id] }));
        setShowDateButtons(prev => ({ ...prev, [id]: false }));
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchStudentsAndGroupCoins(teacherData?.id);
    };

    const handleDateChange = async (student, isUpdating) => {
        if (student.tolov < 90833) {
            alert('Tolov miqdori 90833 dan kam. O\'zgartirish mumkin emas!');
            return;
        }

        const updatedStudent = {
            ...student,
            last: isUpdating ? new Date().toLocaleDateString() : student.last,
            tolov: student.tolov - 90833
        };

        try {
            await axios.put(`http://localhost:5001/students/${student.id}`, updatedStudent);
            setStudents(students.map(s => (s.id === student.id ? updatedStudent : s)));
            setShowDateButtons(prev => ({ ...prev, [student.id]: false }));
        } catch (error) {
            alert("Lastni yangilashda xato: " + error.message);
        }
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
        <div className='flex'>
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
                                <th className="py-4 px-6 text-left">Data</th>
                                <th className="py-4 px-6 w-full text-right  flex items-center gap-3">Coin chegarasi <p className='text-orange-500 text-right'>600</p></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 text-base font-medium">
                            {students.map((student, index) => (
                                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                                    <td className="py-3 px-6 w-64 text-left font-semibold shadow-r-gray" onClick={() => toggleInput(student.id)}>
                                        {index + 1}. {student.name}
                                    </td>
                                    <td className="py-3 px-6 text-left">{student.league}</td>
                                    <td className="py-3 px-6 text-left">{student.coins}</td>
                                    <td className="py-3 px-6 text-left">{student.last}</td>
                                    <td>
                                        <div className="relative inline-block ml-4">
                                            {showDateButtons[student.id] && (
                                                <div className="absolute z-10 flex gap-2 ml-[-15px]  mt-[-35px]">
                                                    <button
                                                        className={` bg-green-500 text-white rounded-md px-3 py-1 ${student.tolov < 90833 ? 'bg-green-800 cursor-not-allowed opacity-50' : ''} `}
                                                        onClick={() => handleDateChange(student, true)}
                                                        disabled={student.tolov < 90833} // Block button if payment is less than 90833
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white rounded-md px-3 py-1"
                                                        onClick={() => handleDateChange(student, false)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setShowDateButtons(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                                                className="bg-blue-500 text-white rounded-md px-2 py-1 ml-2"
                                            >
                                                📅
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-center w-56 ml-5 ">
                                        {showInput[student.id] && (
                                            <div className="flex items-center gap-2 justify-center">
                                                <input
                                                    type="number"
                                                    placeholder="Coins.."
                                                    value={amounts[student.id] || ''}
                                                    onChange={(e) => handleAmountChange(student.id, e.target.value)}
                                                    className={`border border-gray-400 rounded-md p-1 w-24  focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${groupCoins < 1 ? 'bg-green-800 cursor-not-allowed opacity-50' : ''} `}
                                                    disabled={groupCoins < 1} // Block button if payment is less than 90833

                                                />
                                                <button
                                                    onClick={() => handleSubmit(student)}
                                                    className={`bg-emerald-400 text-white rounded-md px-4 py-1 hover:bg-emerald-500 transition-colors shadow-md ${groupCoins < 1 ? 'bg-green-800 cursor-not-allowed opacity-50' : ''} `}
                                                    disabled={groupCoins < 1} // Block button if payment is less than 90833

                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                        {!showInput[student.id] && (
                                            <button
                                                onClick={() => toggleInput(student.id)}
                                                className="bg-emerald-400 text-white rounded-md px-4 py-2 hover:bg-emerald-500 transition-colors shadow-md"
                                            >
                                                <img className='w-4' src="https://cdn-icons-png.flaticon.com/512/134/134597.png" alt="" />
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></div>
        </div>
    );
};

export default StudentList;
