import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentCreate = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://shoopjson-2.onrender.com/api/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://shoopjson-2.onrender.com/api/students/${id}`);
            setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Student Management</h1>
                <Link to="/create-student" className="px-4 py-2 bg-blue-500 text-white rounded-md mb-6 inline-block">
                    Create Student
                </Link>
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Login</th>
                            <th className="border border-gray-300 px-4 py-2">League</th>
                            <th className="border border-gray-300 px-4 py-2">Group</th>
                            <th className="border border-gray-300 px-4 py-2">Teacher</th>
                            <th className="border border-gray-300 px-4 py-2">Coins</th>
                            <th className="border border-gray-300 px-4 py-2">Balance</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.login}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.league}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.group}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.teacher}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.coins}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.balance}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <Link
                                        to={`/edit-student/${student.id}`}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded-md mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentCreate;
