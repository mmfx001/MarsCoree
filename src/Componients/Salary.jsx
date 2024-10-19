import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './saidbar';

const Salary = () => {
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleTables, setVisibleTables] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                if (!loggedInUser) {
                    setError('Foydalanuvchi tizimga kirmagan');
                    return;
                }

                const [teacherResponse, studentsResponse] = await Promise.all([
                    axios.get(`https://shoopjson-2.onrender.com/api/teachers/${loggedInUser.id}`),
                    axios.get('https://shoopjson-2.onrender.com/api/students'),
                ]);

                setTeacher(teacherResponse.data);
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error('O\'qituvchi ma\'lumotlarini olishda xato:', error);
                setError('O\'qituvchi ma\'lumotlarini olishda xato');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center mt-12">Yuklanmoqda...</p>;
    if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;
    if (!teacher) return <p className="text-center mt-12 text-red-500">O'qituvchi topilmadi</p>;

    const groups = Object.entries(teacher).reduce((acc, [key, value]) => {
        if (!['id', 'teacher', 'password', 'students', 'groupcount', 'level'].includes(key)) {
            acc[key] = value;
        }
        return acc;
    }, {});

    const toggleTableVisibility = (groupId) => {
        setVisibleTables((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const totalPayment = Object.keys(groups).reduce((sum, groupId) => {
        const groupStudents = students.filter(student => student.group === groupId);
        const groupTotal = groupStudents.reduce((total, student) => {
            const tolov = parseInt(student.tolov) || 0;
            return total + tolov;
        }, 0);
        return sum + groupTotal;
    }, 0);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex w-full p-6 bg-gray-100 gap-6 ml-24 mt-14">
                <div className='px-6 py-6 bg-gray-50 rounded-2xl shadow-xl w-[50%] h-56'>
                    <h1 className="text-2xl font-semibold">{teacher.teacher}</h1>
                    <div className='flex flex-wrap w-full gap-3'>
                        <div className='w-48 border-2 p-2 rounded-md'>
                            <p className='text-xs'>O'quvchilar soni</p>
                            <p className='font-semibold'>{teacher.students}</p>
                        </div>
                        <div className='w-48 border-2 p-2 rounded-md'>
                            <p className='text-xs'>Gruhlar soni</p>
                            <p className='font-semibold'>{teacher.groupcount}</p>
                        </div>
                        <div className='w-48 border-2 p-2 rounded-md'>
                            <p className='text-xs'>Grade</p>
                            <p className='font-semibold'>{teacher.level}</p>
                        </div>
                    </div>
                </div>

                <div className='w-full'>
                    <div className='p-6 bg-gray-50 rounded-2xl shadow-xl w-full'>
                        <div className='w-full flex items-center justify-between p-4 mt-[-30px]'>
                            <h1 className="text-2xl font-semibold ">Groups</h1>
                            <p className='text-emerald-600 text-3xl font-semibold flex items-center'>{totalPayment.toLocaleString()} <span className='text-xs ml-2 text-gray-500'>so'm</span></p>
                        </div>
                        <hr className='mb-6 mt-5' />
                        {Object.keys(groups).length > 0 ? (
                            <div className="flex flex-col md:grid-cols-2 gap-2">
                                {Object.keys(groups).map((groupId) => {
                                    const groupStudents = students.filter(student => student.group === groupId);
                                    const groupTotal = groupStudents.reduce((total, student) => {
                                        const tolov = parseInt(student.tolov) || 0;
                                        return total + tolov;
                                    }, 0);

                                    return (
                                        <div key={groupId} className="bg-white flex flex-col p-4 w-full justify-between">
                                            <div className="flex items-center justify-between w-full">
                                                <h2 className="text-xl text-black text-center">{teacher.grupNomber}</h2>
                                                <p className='text-lg font-semibold flex items-center gap-1'>{groupTotal.toLocaleString()} <span className='text-xs text-gray-500'>so'm</span>
                                                    <button className='text-3xl ml-5 text-center text-gray-500' onClick={() => toggleTableVisibility(groupId)}>
                                                        {visibleTables[groupId] ? '▼' : '›'}
                                                    </button>
                                                </p>
                                            </div>
                                            {visibleTables[groupId] && ( 
                                                <div>
                                                    <table className="w-full overflow-hidden">
                                                        <thead>
                                                            <tr className="text-black bg-gray-100  w-full text-xs font-semibold">
                                                                <th className="py-4 px-6 w-36 text-left shadow-r-gray">Studentlar</th>
                                                                <th className="py-4 px-6 text-center">Darslar soni</th>
                                                                <th className="py-4 px-6 text-center">Umumiy dars</th>
                                                                <th className="py-4  w-full text-center flex items-center gap-3">Bir oylik darslar uchun haq miqdori</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-800 text-base font-medium">
                                                            {groupStudents.map((student, index) => (
                                                                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                                                                    <td className="py-3 px-6 w-64 text-left font-semibold shadow-r-gray">
                                                                        {index + 1}. {student.name}
                                                                    </td>
                                                                    <td className="py-3 px-6 text-center">12</td>
                                                                    <td className="py-3 px-6 text-center">{student.attendance}</td>
                                                                    <td className="py-3 px-6 text-center">
                                                                        {student.tolov.toLocaleString()}
                                                                        <span className='text-xs text-gray-500 ml-1'>so'm</span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            <hr className='w-full mt-3' />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center mt-12 text-red-500">Guruhlar topilmadi</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Salary;
