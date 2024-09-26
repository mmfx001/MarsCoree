// src/components/TeachersList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/teachers')
      .then(response => {
        setTeachers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
        setError('Ma\'lumotlarni olishda xatolik yuz berdi');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-12">Yuklanmoqda...</p>;
  }

  if (error) {
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Teachers List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <Link to={`/teacher/${teacher.id}`} key={teacher.id}>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-2">{teacher.teacher}</h2>
              <p className="text-gray-600">Level: {teacher.level}</p>
              <p className="text-gray-600">Groups: {teacher.groupcount}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeachersList;
