import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateGroup = () => {
  const [step, setStep] = useState(1); // Step tracking
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [endTime, setEndTime] = useState('');

  // API'dan o'qituvchilarni olish
  useEffect(() => {
    axios.get('https://shoopjson-2.onrender.com/api/teachers')
      .then(response => {
        setTeachers(response.data);
      }).catch(error => console.log(error));
  }, []);

  // Vaqtni hisoblash: Start vaqtini kiritgandan so'ng, bir soat qo'shish
  const handleStartTimeChange = (e) => {
    const start = e.target.value; // Start vaqtini olamiz
    setStartTime(start);

    // Start vaqtiga 1 soat qo'shamiz
    const startDate = new Date(`1970-01-01T${start}:00`);
    startDate.setHours(startDate.getHours() + 1);

    // End vaqtini hisoblaymiz
    const endFormatted = startDate.toISOString().slice(11, 16);
    setEndTime(endFormatted); // End vaqtini saqlaymiz
  };

  // O'qituvchi va xonalar ro'yxatini filtrlash
  useEffect(() => {
    if (day && startTime) {
      const availableTeachers = teachers.filter(teacher => {
        return !teacher.groups.some(group => 
          group.havtaKun === day && group.groupTime.start === startTime
        );
      });

      const availableRooms = availableTeachers.map(teacher => teacher.groups)
        .flat().filter(group => group.havtaKun === day && group.groupTime.start === startTime)
        .map(group => group.rooms);

      setRooms(availableRooms);
      setTeachers(availableTeachers);
    }
  }, [day, startTime, teachers]);

  // O'qituvchi tanlash
  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  // Xona tanlash
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  // Formani yuborish
  const handleSubmit = () => {
    const group = {
      havtaKun: day,
      rooms: selectedRoom,
      teacherName: selectedTeacher,
      groupTime: {
        start: startTime,
        end: endTime,
      },
      groupNumber: `G${Math.floor(Math.random() * 1000)}`,
    };

    // Yangi guruhni APIga yuborish
    axios.post('https://shoopjson-2.onrender.com/api/teachers', group)
      .then(response => {
        console.log('Group created', response);
        alert('Guruh muvaffaqiyatli yaratildi!');
        setStep(1); // Stepni qayta boshlash
      })
      .catch(error => console.log('Error creating group', error));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Guruh yaratish</h2>

      {step === 1 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Hafta kunini tanlang:</label>
          <select 
            value={day} 
            onChange={(e) => setDay(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">Tanlang</option>
            <option value="toq">Toq</option>
            <option value="juft">Juft</option>
          </select>
          
          <button
            onClick={() => setStep(2)}
            disabled={!day}
            className={`w-full p-2 text-white bg-blue-500 rounded-lg ${!day && 'opacity-50 cursor-not-allowed'}`}
          >
            Keyingi
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Boshlanish vaqtini kiriting:</label>
          <input 
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          
          {startTime && (
            <div className="mb-4 text-sm">
              <strong>End Vaqt: </strong>{endTime}
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            disabled={!startTime}
            className={`w-full p-2 text-white bg-blue-500 rounded-lg ${!startTime && 'opacity-50 cursor-not-allowed'}`}
          >
            Keyingi
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-sm font-semibold mb-2">O'qituvchi tanlang:</label>
          <select 
            value={selectedTeacher}
            onChange={handleTeacherChange} 
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">O'qituvchi tanlang</option>
            {teachers.length > 0 ? teachers.map((teacher) => (
              <option key={teacher._id} value={teacher.teacherName}>
                {teacher.teacherName}
              </option>
            )) : (
              <option disabled>O'qituvchilar mavjud emas</option>
            )}
          </select>

          <button
            onClick={() => setStep(4)}
            disabled={!selectedTeacher}
            className={`w-full p-2 text-white bg-blue-500 rounded-lg ${!selectedTeacher && 'opacity-50 cursor-not-allowed'}`}
          >
            Keyingi
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Xona tanlang:</label>
          <select   
            value={selectedRoom}
            onChange={handleRoomChange} 
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">Xona tanlang</option>
            {rooms.length > 0 ? rooms.map((room, index) => (
              <option key={index} value={room}>
                {room}
              </option>
            )) : (
              <option disabled>Xonalar mavjud emas</option>
            )}
          </select>

          <button
            onClick={handleSubmit}
            disabled={!selectedRoom}
            className={`w-full p-2 text-white bg-green-500 rounded-lg ${!selectedRoom && 'opacity-50 cursor-not-allowed'}`}
          >
            Guruhni yaratish
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
