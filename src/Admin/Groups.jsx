import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const Group = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedDay, setSelectedDay] = useState("toq"); // Default: toq
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [groupDetails, setGroupDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // API-dan ma'lumot olish
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://shoopjson-2.onrender.com/api/teachers"
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Ma'lumotni olishda xatolik yuz berdi:", error);
      } finally {
        setIsLoading(false); // Data loaded, set loading to false
      }
    };

    fetchTeachers();
  }, []);

  // Tanlangan kun bo'yicha rooms ni filtrlash
  useEffect(() => {
    if (teachers.length > 0) {
      const filteredRooms = teachers.flatMap((teacher) =>
        teacher.groups
          .filter((group) => group.havtaKun === selectedDay)
          .map((group) => group.rooms)
      );
      setRooms([...new Set(filteredRooms)]); // Dublikatlardan tozalash
    }
  }, [teachers, selectedDay]);

  // Room bo'yicha guruhlarni filtrlash
  useEffect(() => {
    if (selectedRoom) {
      const filteredGroups = teachers.flatMap((teacher) =>
        teacher.groups.filter(
          (group) => group.rooms === selectedRoom && group.havtaKun === selectedDay
        )
      );
      setGroupDetails(filteredGroups);
    }
  }, [selectedRoom, selectedDay, teachers]);

  return (
    <div className="w-full flex">
         <Sidebar/>   
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Havta kunini tanlash */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setSelectedDay("juft")}
            className={`px-6 py-3 mx-2 rounded-lg shadow-md font-medium transition-all duration-300 ${
              selectedDay === "juft"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
            }`}
          >
            Juft kunlar
          </button>
          <button
            onClick={() => setSelectedDay("toq")}
            className={`px-6 py-3 mx-2 rounded-lg shadow-md font-medium transition-all duration-300 ${
              selectedDay === "toq"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
            }`}
          >
            Toq kunlar
          </button>
        </div>

        {/* Tanlangan kun bo'yicha rooms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Rooms</h2>
          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <div className="w-24 h-12 bg-gray-300 animate-pulse rounded-lg" />
            ) : (
              rooms.map((room, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-5 py-3 rounded-lg shadow-md font-medium transition-all duration-300 ${
                    selectedRoom === room
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                  }`}
                >
                  {room}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Tanlangan room bo'yicha guruhlar */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-300 mb-2 rounded-md" />
                <div className="h-4 bg-gray-300 mb-2 rounded-md" />
                <div className="h-4 bg-gray-300 mb-2 rounded-md" />
                <div className="h-4 bg-gray-300 mb-2 rounded-md" />
              </div>
            ))}
          </div>
        ) : selectedRoom && groupDetails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupDetails.map((group, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Guruh raqami: {group.groupNumber}
                </h2>
                <p className="text-gray-700">
                  <strong>O'qituvchi:</strong> {group.teacherName}
                </p>
                <p className="text-gray-700">
                  <strong>Xona raqami:</strong> {group.rooms}
                </p>
                <p className="text-gray-700">
                  <strong>Dars vaqti:</strong> {group.groupTime.start} - {group.groupTime.end}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Hech qanday guruh topilmadi yoki to'liq malumot bermadingiz</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Group;
