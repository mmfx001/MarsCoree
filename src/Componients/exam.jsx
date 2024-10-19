import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChildSidebar from './childsaidbar';

const Exam = () => {
    const { groupId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [examData, setExamData] = useState({ date: '', createdAt: null });
    const [students, setStudents] = useState([]);
    const [isExamOpen, setIsExamOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedGroupId = JSON.parse(localStorage.getItem('selectedGroupId'));
                if (!storedGroupId) {
                    setError('Foydalanuvchi tizimga kirmagan');
                    return;
                }

                const studentsResponse = await axios.get('https://shoopjson-2.onrender.com/api/students');
                const filteredStudents = studentsResponse.data.filter(student => student.group === storedGroupId);
                setStudents(filteredStudents);
            } catch (error) {
                console.error('Ma\'lumotlarni olishda xato:', error);
                setError('Ma\'lumotlarni olishda xato');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [groupId]);

    useEffect(() => {
        const checkExamStatus = () => {
            const now = Date.now();
            if (examData.createdAt) {
                const timeElapsed = now - examData.createdAt;
                if (timeElapsed >= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
                    setIsExamOpen(true);
                }
            }
        };

        const intervalId = setInterval(checkExamStatus, 1000); // Check every second

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [examData]);

    const handleExamChange = (e) => {
        const { name, value } = e.target;
        setExamData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleExamSubmit = async (e) => {
        e.preventDefault();
        if (!examData.date) {
            alert('Iltimos, sanani tanlang.');
            return;
        }

        try {
            // Check for existing exams on the same date for the group
            const hasConflictingExam = students.some(student =>
                student.exams?.some(exam => exam.date === examData.date)
            );

            if (hasConflictingExam) {
                alert('Ushbu sana uchun imtihon allaqachon mavjud.');
                return;
            }

            // Prepare new exam data for the selected group of students
            const newExam = { date: examData.date, createdAt: Date.now() };

            // Update or add exam for each student in the selected group
            await Promise.all(students.map(async (student) => {
                await axios.put(`https://shoopjson-2.onrender.com/api/students/${student.id}`, {
                    ...student,
                    exams: [...(student.exams || []), newExam],
                });
            }));

            setExamData((prevData) => ({
                ...prevData,
                createdAt: newExam.createdAt,
            }));

            alert('Imtihon muvaffaqiyatli yaratildi!');
        } catch (error) {
            console.error('Imtihon ma\'lumotlarini yangilashda xato:', error);
            alert(`Xato: ${error.message}`);
        }
    };

    if (loading) return <div className="text-center">Yuklanmoqda...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <ChildSidebar />
            <div className="flex-1 p-6 ml-24 mt-24">
                <h1 className="text-3xl  font-bold text-center mb-6">Imtihon yaratish</h1>
                <form onSubmit={handleExamSubmit} className='bg-white p-6 rounded-lg shadow-md'>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="date">
                            Sana:
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={examData.date}
                            onChange={handleExamChange}
                            required
                            className="border border-gray-300 p-2 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                    >
                        Imtihon yaratish
                    </button>
                </form>
                {isExamOpen && <div className="mt-4 text-green-600 text-center font-bold">Imtihon ochildi!</div>}
            </div>
        </div>
    );
};

export default Exam;
