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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, teachersResponse] = await Promise.all([
                    axios.get('https://shoopjson-2.onrender.com/api/students'),
                    axios.get('https://shoopjson-2.onrender.com/api/teachers')
                ]);
                setStudents(studentsResponse.data);
                setTeachers(teachersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (student) => {
        setEditingStudent(student.id);
        setEditedData({ ...student });
        setAvailableGroupsEdit(getGroupsByTeacher(student.teacher));
    };

    const handleSave = async () => {
        try {
            await axios.patch(`https://shoopjson-2.onrender.com/api/students/${editingStudent}`, editedData);
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudent ? { ...editedData, id: student.id } : student
                )
            );
            setEditingStudent(null);
            setAvailableGroupsEdit([]);
        } catch (error) {
            console.error('Error saving student:', error);
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
            tasks: [
                { "id": "1", "Topic": "Введение Front-End", "description": "Создайте небольшой информационный сайт о себе с помощью тегов, которые вы сегодня узнали на уроке.", "requirement": "Использование тегов заголовков.", "materials": "https://lab.marsit.uz/media/project_images/examples/289/4.4_-_homework.mp4" },
                { "id": "2", "Topic": "HTML теги и их атрибуты", "description": "Создайте мини-сайт о себе, используя теги, которые вы сегодня узнали на уроке.", "requirement": "Использование тегов, включая тег <mark>.", "materials": "https://lab.marsit.uz/media/project_images/examples/103/Homework2.png" },
                { "id": "3", "Topic": "Iframe vs Img", "description": "Создайте небольшой информационный сайт о себе с помощью тегов, которые вы сегодня узнали на уроке.", "requirement": "Использование тегов <img> и <iframe>, а также тег <a>.", "materials": "https://lab.marsit.uz/media/project_images/examples/104/homework3.png" },
                { "id": "4", "Topic": "Список тегов", "description": "Создайте небольшой сайт с информацией о Mars It School, используя теги Ordered и Unordered, и придайте ему стиль с помощью тегов, которые мы узнали сегодня.", "requirement": "Использование списков тегов, тегов <img>, встроенных стилей и тега <a>.", "materials": "https://lab.marsit.uz/media/project_images/examples/105/homework4.png" },
                { "id": "5", "Topic": "Введение Css", "description": "Создайте небольшую веб-страницу на основе сегодняшней темы и используйте стили.", "requirement": "Правильное подключение CSS файла, использование тега <h1>, стилей border и работа с цветами.", "materials": "https://lab.marsit.uz/media/project_images/examples/106/homework5.png" },
                { "id": "6", "Topic": "Теги формы", "description": "Создайте небольшую форму, используя теги формы, и настройте ее стиль.", "requirement": "Правильные типы инпутов, использование тега <button>, открытый CSS файл, использование классов для закрашивания цветов и тегов <input>.", "materials": "https://lab.marsit.uz/media/project_images/examples/107/homework6.png" },
                { "id": "7", "Topic": "Box modeling", "description": "Создайте небольшой сайт о Margin, Padding, Border и Forms.", "requirement": "Использование тегов форм, центрирование текстов, использование margin и padding, применение цветов с помощью CSS.", "materials": "https://lab.marsit.uz/media/project_images/examples/108/Homework7.png" },
                { "id": "8", "Topic": "Table", "description": "Создайте небольшую таблицу с помощью тега <table>.", "requirement": "Создание таблицы, задний фон задан с помощью CSS, таблица выровнена по центру.", "materials": "https://lab.marsit.uz/media/project_images/examples/109/Homework8.png" },
                { "id": "9", "Topic": "FlexBox", "description": "Выполните задачу с помощью FlexBox.", "requirement": "Использование FlexBox, применение цветов с помощью CSS.", "materials": "https://lab.marsit.uz/media/project_images/examples/110/Flex9.png" },
                { "id": "10", "Topic": "Container", "description": "Выполните задание до конца, используя контейнер.", "requirement": "Закончить проект полностью.", "materials": "https://lab.marsit.uz/media/project_images/examples/111/Container.png" },
                { "id": "11", "Topic": "Практика FlexBox", "description": "Сделать проект до конца.", "requirement": "Правильно расположены карточки, сайт полностью завершен.", "materials": "https://lab.marsit.uz/media/project_images/examples/112/Flex_task_11_dars.png" }
            ],
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
                            onChange={handleTeacherChange}
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

                <h2 className="text-xl font-semibold mb-4">Students List</h2>
                <div>
                    {students.map((student) => (
                        <div key={student.id} className="border p-4 mb-4">
                            <div className="font-semibold">{student.name}</div>
                            <div>{student.league}</div>
                            <div>{student.group}</div>
                            <div>{student.teacher}</div>
                            <button onClick={() => handleEdit(student)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Edit</button>
                            <button onClick={() => handleDelete(student.id)} className="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCreate;
