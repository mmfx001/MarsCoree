import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentCreate = () => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [newStudentData, setNewStudentData] = useState({
        name: '',
        login: '',
        league: '',
        group: '',
        teacher: ''
    });
    const [availableGroups, setAvailableGroups] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [availableGroupsEdit, setAvailableGroupsEdit] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, teachersResponse] = await Promise.all([
                    axios.get('https://shoopjson-2.onrender.com/api/students'),
                    axios.get('https://shoopjson-2.onrender.com/api/teachers')
                ]);
                setStudents(studentsResponse.data);
                setTeachers(teachersResponse.data);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false even if there is an error
            }
        };

        fetchData();
    }, []);

    const handleEdit = (student) => {
        setEditingStudent(student.id);
        setEditedData({
            name: student.name,
            league: student.league,
            group: student.group,
            teacher: student.teacher,
        });

        const groups = getGroupsByTeacher(student.teacher);
        setAvailableGroupsEdit(groups || []);
    };

    const handleSave = async () => {
        if (!editedData.name || !editedData.league || !editedData.group || !editedData.teacher) {
            alert("All fields are required!");
            return;
        }

        try {
            const apiUrl = `https://shoopjson-2.onrender.com/api/students/${editingStudent}`;
            const response = await axios.put(apiUrl, editedData);

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudent ? { ...response.data } : student
                )
            );

            setEditingStudent(null);
            setEditedData({});
            setAvailableGroupsEdit([]);
        } catch (error) {
            console.error('Error saving student:', error.response ? error.response.data : error.message);
            alert('Failed to save student. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://shoopjson-2.onrender.com/api/students/${id}`);
            setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const generateRandomId = () => {
        return Math.floor(Math.random() * 10000).toString();
    };

    const handleTeacherChange = (e) => {
        const selectedTeacher = e.target.value;
        setNewStudentData({ ...newStudentData, teacher: selectedTeacher });

        const teacher = teachers.find((teacher) => teacher.teacher === selectedTeacher);
        if (teacher) {
            const groups = teacher.groups || [];
            setAvailableGroups(groups);
        }
    };

    const handleAddStudent = async () => {
        const randomId = generateRandomId();
        const newStudent = {
            ...newStudentData,
            id: randomId,
            password: randomId,
            coins: 0,
            balance: 0,
            tolov: 0,
            attendance: 0,
            xp: 0,
            tasks: []
        };

        try {
            await axios.post('https://shoopjson-2.onrender.com/api/students', newStudent);
            setStudents((prevStudents) => [...prevStudents, newStudent]);
            setNewStudentData({ name: '', league: '', group: '', teacher: '', login: '' });
            setAvailableGroups([]);
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const getGroupsByTeacher = (teacherName) => {
        const teacher = teachers.find((teacher) => teacher.teacher === teacherName);
        return teacher ? teacher.groups : [];
    };

    const handleTeacherChangeEdit = (e) => {
        const selectedTeacher = e.target.value;
        setEditedData({ ...editedData, teacher: selectedTeacher });

        const groups = getGroupsByTeacher(selectedTeacher);
        setAvailableGroupsEdit(groups || []);
    };

    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Student Management</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }}>
                        <input
                            type="text"
                            value={newStudentData.name}
                            onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                            className="w-full p-2 mb-3 border rounded-md"
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            value={newStudentData.login}
                            onChange={(e) => setNewStudentData({ ...newStudentData, login: e.target.value })}
                            className="w-full p-2 mb-3 border rounded-md"
                            placeholder="Login"
                        />
                        <input
                            type="text"
                            value={newStudentData.league}
                            onChange={(e) => setNewStudentData({ ...newStudentData, league: e.target.value })}
                            className="w-full p-2 mb-3 border rounded-md"
                            placeholder="League"
                        />
                        <select
                            value={newStudentData.teacher}
                            onChange={(e) => handleTeacherChange(e)}
                            className="w-full p-2 mb-3 border rounded-md"
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.teacher}>
                                    {teacher.teacher}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newStudentData.group}
                            onChange={(e) => setNewStudentData({ ...newStudentData, group: e.target.value })}
                            className="w-full p-2 mb-3 border rounded-md"
                        >
                            <option value="">Select Group</option>
                            {availableGroups.map((group, index) => (
                                <option key={index} value={group.groupNumber}>
                                    Group {group.groupNumber}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Student</button>
                    </form>
                </div>

                {loading ? (
                    <div className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-8 bg-gray-300 rounded mb-4"></div>
                        ))}
                    </div>
                ) : (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Login</th>
                                <th className="border p-2">League</th>
                                <th className="border p-2">Group</th>
                                <th className="border p-2">Teacher</th>
                                <th className="border p-2">Balance</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    {editingStudent === student.id ? (
                                        <>
                                            <td className="border p-2">{student.id}</td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={editedData.name}
                                                    onChange={(e) =>
                                                        setEditedData({ ...editedData, name: e.target.value })
                                                    }
                                                    className="w-full border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">{student.login}</td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={editedData.league}
                                                    onChange={(e) =>
                                                        setEditedData({ ...editedData, league: e.target.value })
                                                    }
                                                    className="w-full border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={editedData.group}
                                                    onChange={(e) =>
                                                        setEditedData({ ...editedData, group: e.target.value })
                                                    }
                                                    className="w-full border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={editedData.teacher}
                                                    onChange={(e) =>
                                                        setEditedData({ ...editedData, teacher: e.target.value })
                                                    }
                                                    className="w-full border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">{student.balance}</td>
                                            <td className="border p-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="bg-green-500 text-white px-4 py-1 rounded-md mr-2"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingStudent(null)}
                                                    className="bg-gray-500 text-white px-4 py-1 rounded-md"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border p-2">{student.id}</td>
                                            <td className="border p-2">{student.name}</td>
                                            <td className="border p-2">{student.login}</td>
                                            <td className="border p-2">{student.league}</td>
                                            <td className="border p-2">{student.group}</td>
                                            <td className="border p-2">{student.teacher}</td>
                                            <td className="border p-2">{student.balance}</td>
                                            <td className="border p-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="bg-yellow-500 text-white px-4 py-1 rounded-md mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="bg-red-500 text-white px-4 py-1 rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentCreate;
